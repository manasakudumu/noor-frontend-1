import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";
import { NotAllowedError, NotFoundError } from "./errors";

export interface CheckInScheduleDoc extends BaseDoc {
  userId: ObjectId;
  schedule: Date;
}

export interface UserCheckInStatusDoc extends BaseDoc {
  userId: ObjectId;
  status: boolean;
  checkInBy?: ObjectId; // ID of who completed the check-in (user or trusted contact)
  checkInTime?: Date;
}

export interface TrustedContact {
  contactId: ObjectId;
  contactName: string;
}

/**
 * concept: Monitoring [User]
 */
export default class MonitoringConcept {
  public readonly checkInSchedules: DocCollection<CheckInScheduleDoc>;
  public readonly checkInStatus: DocCollection<UserCheckInStatusDoc>;

  constructor(collectionName: string) {
    this.checkInSchedules = new DocCollection<CheckInScheduleDoc>(collectionName + "_schedules");
    this.checkInStatus = new DocCollection<UserCheckInStatusDoc>(collectionName + "_status");
  }

  // Schedule a weekly check-in for a user
  async scheduleWeeklyCheckIn(userId: ObjectId, trustedContacts: TrustedContact[], schedule: Date) {
    const existing = await this.checkInSchedules.readOne({ userId });
    if (existing !== null) {
      throw new NotAllowedError("User already has a scheduled check-in.");
    }
    await this.checkInSchedules.createOne({ userId, schedule });
    trustedContacts.forEach((contact) => {
      console.log(`Notifying trusted contact ${contact.contactName} to check in on user ${userId}`);
    });
    return { msg: "Weekly check-in scheduled successfully!", contactsNotified: trustedContacts };
  }

  // Record a check-in for a user (self check-in or by a trusted contact)
  async recordCheckIn(userId: ObjectId, checkedInBy: ObjectId) {
    const checkIn = await this.checkInSchedules.readOne({ userId });
    if (!checkIn) {
      throw new NotFoundError("No check-in schedule found for user.");
    }
    const currentTime = new Date();
    await this.checkInStatus.createOne({ userId, status: true, checkInBy: checkedInBy, checkInTime: currentTime });

    return { msg: `Check-in recorded successfully by ${checkedInBy}.`, time: currentTime };
  }

  // Ask check-up questions to user or trusted contacts
  async askCheckUpQuestions(userId: ObjectId, trustedContactId: ObjectId, questions: string[]) {
    const userCheckInStatus = await this.checkInStatus.readOne({ userId });
    // Check if the user or trusted contact needs to be asked questions
    if (userCheckInStatus && userCheckInStatus.status) {
      return { msg: "Check-in already completed for this week. No need to ask further questions." };
    }
    console.log(`Sending check-up questions to trusted contact ${trustedContactId}:`, questions);
    return { msg: "Questions sent to trusted contact", questions };
  }

  // Get check-in status for a user
  async getCheckInStatus(userId: ObjectId) {
    const status = await this.checkInStatus.readOne({ userId });
    if (!status) {
      throw new NotFoundError("No check-in status found for user.");
    }
    return status;
  }

  // Alert trusted contacts if no check-in was recorded
  async alertTrustedContacts(userId: ObjectId, trustedContacts: TrustedContact[]) {
    const status = await this.checkInStatus.readOne({ userId });
    if (!status || !status.status) {
      trustedContacts.forEach((contact) => {
        console.log(`ALERT: Trusted contact ${contact.contactName} is being notified for check-in on user ${userId}`);
      });
      return { msg: "Alerting trusted contacts!", contacts: trustedContacts };
    }
    return { msg: "No alerts needed. User checked in successfully." };
  }
}
