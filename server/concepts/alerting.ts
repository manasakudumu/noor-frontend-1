import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";
import { NotAllowedError, NotFoundError } from "./errors";
import MessagingService from "./messaging"; // Adjust path as needed
const messagingService = new MessagingService("messages"); // Provide your collection name as needed

export interface AlertDoc extends BaseDoc {
  userId: ObjectId;
  status: boolean;
  street: string;
  city: string;
  state: string;
  zipcode: string;
  latitude: number;
  longitude: number;
  trustedContacts: { contactId: ObjectId; name: string; phone: string }[];
}

/**
 * concept: Alerting [User]
 */
export default class AlertingConcept {
  public readonly alerts: DocCollection<AlertDoc>;

  constructor(collectionName: string) {
    this.alerts = new DocCollection<AlertDoc>(collectionName + "_alerts");
  }

  // Create a new location for a user
  async create(
    userId: ObjectId,
    street: string,
    city: string,
    state: string,
    zipcode: string,
    latitude: number,
    longitude: number,
    trustedContacts: { contactId: ObjectId; name: string; phone: string }[], // Pass in trusted contacts
  ) {
    const _id = await this.alerts.createOne({
      userId,
      street,
      city,
      state,
      zipcode,
      latitude,
      longitude,
      status: false, // Initially false until emergency is activated
      trustedContacts,
    });
    return { msg: `New location for user created and geo-tagged at (${latitude}, ${longitude})`, location: await this.alerts.readOne({ _id }) };
  }

  // Get all locations
  async getLocations() {
    return await this.alerts.readMany({}, { sort: { _id: -1 } });
  }

  async getByName(name: string) {
    return await this.alerts.readOne({ name });
  }

  async getByState(state: string) {
    return await this.alerts.readMany({ state });
  }

  async getByCity(city: string, state: string) {
    return await this.alerts.readMany({ city, state });
  }

  async getByZipcode(zipcode: string) {
    return await this.alerts.readMany({ zipcode });
  }

  async delete(_id: ObjectId) {
    await this.alerts.deleteOne({ _id });
    return { msg: "Location removed successfully!" };
  }

  // Activate emergency alert and notify trusted contacts
  async activateEmergencyAlert(userId: ObjectId) {
    const existingAlert = await this.alerts.readOne({ userId });
    if (!existingAlert) {
      throw new NotFoundError("No location data found for this user. Cannot activate emergency alert.");
    }
    if (existingAlert.status) {
      throw new NotAllowedError("Emergency alert already active for this user.");
    }
    await this.alerts.partialUpdateOne({ userId }, { status: true });
    await this.notifyTrustedContacts(existingAlert.trustedContacts, userId, existingAlert);
    return { msg: "Emergency alert activated and contacts notified!" };
  }

  async deactivateEmergencyAlert(userId: ObjectId) {
    const alert = await this.alerts.readOne({ userId });
    if (!alert || !alert.status) {
      throw new NotFoundError("No active emergency alert found for this user.");
    }
    await this.alerts.partialUpdateOne({ userId }, { status: false });
    return { msg: "Emergency alert deactivated!" };
  }

  async notifyTrustedContacts(trustedContacts: { contactId: ObjectId; name: string; phone: string }[], userId: ObjectId, alertData: AlertDoc) {
    for (const contact of trustedContacts) {
      // Using `contact.contactId` as the recipient ID and sending additional information
      await messagingService.sendMessage(
        contact.contactId,
        userId,
        `Emergency alert! Location: ${alertData.street}, ${alertData.city}, ${alertData.state}. Contact ${contact.name} (${contact.phone}) for assistance.`,
      );
    }
  }

  async addTrustedContact(userId: ObjectId, contactName: string, contactPhone: string) {
    const contactId = new ObjectId();

    const result = await this.alerts.collection.updateOne(
      { userId },
      {
        $push: {
          trustedContacts: {
            contactId,
            name: contactName,
            phone: contactPhone,
          },
        },
      },
    );
    if (result.modifiedCount === 0) {
      throw new NotFoundError("User alert not found or contact was not added.");
    }
    return { msg: "Trusted contact added successfully", contactId };
  }

  async removeTrustedContact(userId: ObjectId, contactId: ObjectId) {
    const result = await this.alerts.collection.updateOne(
      { userId },
      {
        $pull: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          trustedContacts: { contactId } as any,
        },
      },
    );
    if (result.modifiedCount === 0) {
      throw new NotFoundError("User alert not found or contact was not removed.");
    }
    return { msg: "Trusted contact removed successfully" };
  }

  async assertLocationExists(_id: ObjectId) {
    const location = await this.alerts.readOne({ _id });
    if (!location) {
      throw new NotFoundError(`Location with id ${_id} does not exist!`);
    }
  }
}
