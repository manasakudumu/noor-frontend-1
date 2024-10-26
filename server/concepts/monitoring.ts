import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";
import { NotFoundError } from "./errors";
import MessagingService from "./messaging"; // Import for notifying contacts

export interface MonitoringDoc extends BaseDoc {
  userId: ObjectId;
  schedule: Date | null;
  lastCheckIn: Date | null;
  status: boolean;
  trustedContacts: ObjectId[];
}

/**
 * Monitoring Concept - Manages check-in scheduling, status, and alerts.
 */
export default class MonitoringConcept {
  public readonly monitoringData: DocCollection<MonitoringDoc>;
  private readonly messagingService: MessagingService;

  constructor(collectionName: string) {
    this.monitoringData = new DocCollection<MonitoringDoc>(collectionName);
    this.messagingService = new MessagingService("messages");
  }

  // Schedule a weekly check-in or update an existing schedule
  async scheduleCheckIn(userId: ObjectId, schedule: Date, trustedContacts: ObjectId[]) {
    const existingRecord = await this.monitoringData.readOne({ userId });
    if (existingRecord) {
      await this.monitoringData.partialUpdateOne({ userId }, { schedule, trustedContacts });
    } else {
      await this.monitoringData.createOne({ userId, schedule, lastCheckIn: null, status: false, trustedContacts });
    }

    return { msg: "Check-in schedule set successfully." };
  }

  // Record a check-in
  async recordCheckIn(userId: ObjectId) {
    const currentTime = new Date();
    const updated = await this.monitoringData.partialUpdateOne({ userId }, { lastCheckIn: currentTime, status: true });

    if (!updated) {
      throw new NotFoundError("No monitoring record found for this user.");
    }
    return { msg: "Check-in recorded successfully.", time: currentTime };
  }

  // Get monitoring information for a user
  async getMonitoringInfo(userId: ObjectId) {
    const record = await this.monitoringData.readOne({ userId });
    if (!record || !("status" in record)) {
      return { msg: "No monitoring record found." };
    }
    return record;
  }

  // Alert trusted contacts if check-in was missed
  async alertTrustedContacts(userId: ObjectId) {
    const record = await this.monitoringData.readOne({ userId });
    if (!record || !("status" in record) || record.status) {
      return { msg: "No alert needed." };
    }

    // Send alert messages to each trusted contact
    for (const contactId of record.trustedContacts) {
      await this.messagingService.sendMessage(contactId, userId, `Missed check-in alert for user: ${userId}. Please check on them.`);
    }
    return { msg: "Alert sent to trusted contacts." };
  }

  // Reset check-in status (e.g., after an alert)
  async resetStatus(userId: ObjectId) {
    const updated = await this.monitoringData.partialUpdateOne({ userId }, { status: false });
    if (!updated) {
      throw new NotFoundError("Monitoring record not found to reset.");
    }
    return { msg: "Check-in status reset successfully." };
  }
}
