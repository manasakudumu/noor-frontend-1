import { ObjectId } from "mongodb";

import { Router, getExpressRouter } from "./framework/router";

import { Alerting, Authing, Friending, Messaging, Monitoring, Posting, Sessioning } from "./app";
import { AlertDoc } from "./concepts/alerting";
import { PostOptions } from "./concepts/posting";
import { SessionDoc } from "./concepts/sessioning";
import Responses from "./responses";

import { z } from "zod";

/**
 * Web server routes for the app. Implements synchronizations between concepts.
 */
class Routes {
  // Synchronize the concepts from `app.ts`.

  @Router.get("/session")
  async getSessionUser(session: SessionDoc) {
    const user = Sessioning.getUser(session);
    return await Authing.getUserById(user);
  }

  @Router.get("/users")
  async getUsers() {
    return await Authing.getUsers();
  }

  @Router.get("/users/:username")
  @Router.validate(z.object({ username: z.string().min(1) }))
  async getUser(username: string) {
    return await Authing.getUserByUsername(username);
  }

  @Router.post("/users")
  async createUser(session: SessionDoc, username: string, password: string) {
    try {
      console.log("Received create user request:", username, password);
      Sessioning.isLoggedOut(session);
      const result = await Authing.create(username, password);
      console.log("User created successfully:", result);
      return result;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error; // or return a more detailed error response
    }
  }

  @Router.patch("/users/username")
  async updateUsername(session: SessionDoc, username: string) {
    const user = Sessioning.getUser(session);
    return await Authing.updateUsername(user, username);
  }

  @Router.patch("/users/password")
  async updatePassword(session: SessionDoc, currentPassword: string, newPassword: string) {
    const user = Sessioning.getUser(session);
    return Authing.updatePassword(user, currentPassword, newPassword);
  }

  @Router.delete("/users")
  async deleteUser(session: SessionDoc) {
    const user = Sessioning.getUser(session);
    Sessioning.end(session);
    return await Authing.delete(user);
  }

  @Router.post("/login")
  async logIn(session: SessionDoc, username: string, password: string) {
    const u = await Authing.authenticate(username, password);
    Sessioning.start(session, u._id);
    return { msg: "Logged in!" };
  }

  @Router.post("/logout")
  async logOut(session: SessionDoc) {
    Sessioning.end(session);
    return { msg: "Logged out!" };
  }

  @Router.get("/posts")
  @Router.validate(z.object({ author: z.string().optional() }))
  async getPosts(author?: string) {
    let posts;
    if (author) {
      const id = (await Authing.getUserByUsername(author))._id;
      posts = await Posting.getByAuthor(id);
    } else {
      posts = await Posting.getPosts();
    }
    return Responses.posts(posts);
  }

  @Router.post("/posts")
  async createPost(session: SessionDoc, content: string, options?: PostOptions) {
    const user = Sessioning.getUser(session);
    const created = await Posting.create(user, content, options);
    return { msg: created.msg, post: await Responses.post(created.post) };
  }

  @Router.patch("/posts/:id")
  async updatePost(session: SessionDoc, id: string, content?: string, options?: PostOptions) {
    const user = Sessioning.getUser(session);
    const oid = new ObjectId(id);
    await Posting.assertAuthorIsUser(oid, user);
    return await Posting.update(oid, content, options);
  }

  @Router.delete("/posts/:id")
  async deletePost(session: SessionDoc, id: string) {
    const user = Sessioning.getUser(session);
    const oid = new ObjectId(id);
    await Posting.assertAuthorIsUser(oid, user);
    return Posting.delete(oid);
  }

  @Router.get("/friends")
  async getFriends(session: SessionDoc) {
    const user = Sessioning.getUser(session);
    return await Authing.idsToUsernames(await Friending.getFriends(user));
  }

  @Router.delete("/friends/:friend")
  async removeFriend(session: SessionDoc, friend: string) {
    const user = Sessioning.getUser(session);
    const friendOid = (await Authing.getUserByUsername(friend))._id;
    return await Friending.removeFriend(user, friendOid);
  }

  @Router.get("/friend/requests")
  async getRequests(session: SessionDoc) {
    const user = Sessioning.getUser(session);
    return await Responses.friendRequests(await Friending.getRequests(user));
  }

  @Router.post("/friend/requests/:to")
  async sendFriendRequest(session: SessionDoc, to: string) {
    const user = Sessioning.getUser(session);
    const toOid = (await Authing.getUserByUsername(to))._id;
    return await Friending.sendRequest(user, toOid);
  }

  @Router.delete("/friend/requests/:to")
  async removeFriendRequest(session: SessionDoc, to: string) {
    const user = Sessioning.getUser(session);
    const toOid = (await Authing.getUserByUsername(to))._id;
    return await Friending.removeRequest(user, toOid);
  }

  @Router.put("/friend/accept/:from")
  async acceptFriendRequest(session: SessionDoc, from: string) {
    const user = Sessioning.getUser(session);
    const fromOid = (await Authing.getUserByUsername(from))._id;
    return await Friending.acceptRequest(fromOid, user);
  }

  @Router.put("/friend/reject/:from")
  async rejectFriendRequest(session: SessionDoc, from: string) {
    const user = Sessioning.getUser(session);
    const fromOid = (await Authing.getUserByUsername(from))._id;
    return await Friending.rejectRequest(fromOid, user);
  }

  // Montoring routes
  // Route to schedule or update a check-in schedule and trusted contacts
  @Router.post("/monitoring/schedule")
  @Router.validate(
    z.object({
      scheduleTime: z.string().nonempty(), // Expected ISO string for date
      trustedContacts: z.array(z.string()).optional(), // Optional array of contact IDs
    }),
  )
  async scheduleCheckIn(session: SessionDoc, scheduleTime: string, trustedContacts: string[]) {
    const user = Sessioning.getUser(session);
    const date = new Date(scheduleTime);
    const contactIds = trustedContacts.map((id) => new ObjectId(id));
    return await Monitoring.scheduleCheckIn(user, date, contactIds);
  }

  // Route to get the current monitoring information (status, last check-in, schedule)
  @Router.get("/monitoring/status")
  async getMonitoringStatus(session: SessionDoc) {
    const user = Sessioning.getUser(session);
    return await Monitoring.getMonitoringInfo(user);
  }

  @Router.post("/monitoring/checkin")
  async recordCheckIn(session: SessionDoc) {
    const user = Sessioning.getUser(session);
    const checkInStatus = await Monitoring.recordCheckIn(user);
    if (!checkInStatus) {
      await Monitoring.alertTrustedContacts(user);
    }
    return { msg: "Check-in recorded and contacts notified if status is missed." };
  }

  // Route to send an alert to trusted contacts if check-in is missed
  @Router.post("/monitoring/alert")
  async alertTrustedContacts(session: SessionDoc) {
    const user = Sessioning.getUser(session);
    const monitoringInfo = await Monitoring.getMonitoringInfo(user);
    if (!("status" in monitoringInfo)) {
      return { msg: "No monitoring record found." };
    }
    if (!monitoringInfo.status) {
      return await Monitoring.alertTrustedContacts(user);
    }

    return { msg: "No alert needed." };
  }
  @Router.patch("/monitoring/reset")
  async resetCheckInStatus(session: SessionDoc) {
    const user = Sessioning.getUser(session);
    return await Monitoring.resetStatus(user);
  }

  // Alerting Routes
  @Router.post("/alert")
  async activateEmergencyAlert(session: SessionDoc) {
    const user = Sessioning.getUser(session);
    return await Alerting.activateEmergencyAlert(user); //line 188
  }

  async notifyTrustedContacts(contactIds: ObjectId[], userId: ObjectId, alertData: AlertDoc) {
    for (const contactId of contactIds) {
      await Messaging.sendMessage(userId, contactId, `Emergency alert! Location: ${alertData.street}, ${alertData.city}`);
    }
  }

  @Router.delete("/alert/remove-trusted-contact")
  async removeTrustedContact(session: SessionDoc, contactId: string) {
    const user = Sessioning.getUser(session);
    return await Alerting.removeTrustedContact(user, new ObjectId(contactId));
  }

  @Router.post("/alert/deactivate")
  @Router.validate(z.object({ contactId: z.string() }))
  async deactivateEmergencyAlert(session: SessionDoc, contactId: string) {
    const user = Sessioning.getUser(session);
    const contactExists = await Alerting.isTrustedContact(user, new ObjectId(contactId));
    if (!contactExists) {
      throw new Error("Unauthorized access: Only a trusted contact can deactivate an emergency alert.");
    }
    return await Alerting.deactivateEmergencyAlert(user);
  }

  @Router.post("/alert/add-trusted-contact")
  @Router.validate(
    z.object({
      name: z.string().nonempty("Name is required"),
      phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format"),
    }),
  )
  async addTrustedContact(session: SessionDoc, name: string, phone: string) {
    const user = Sessioning.getUser(session);
    return await Alerting.addTrustedContact(user, name, phone);
  }

  // Messaging Routes
  @Router.post("/messages/send")
  async sendMessage(session: SessionDoc, recipient: string, messageText: string) {
    const sender = Sessioning.getUser(session);
    const recipientUser = await Authing.getUserByUsername(recipient);
    return await Messaging.sendMessage(recipientUser._id, sender, messageText);
  }

  @Router.get("/messages")
  async getMessages() {
    return await Messaging.fetchAllMessages();
  }

  @Router.get("/messages/sent")
  async getSentMessages(session: SessionDoc) {
    const sender = Sessioning.getUser(session);
    return await Messaging.getMessagesBySender(sender);
  }

  @Router.get("/messages/conversation/:username")
  @Router.validate(z.object({ username: z.string().min(1) }))
  async getConversation(session: SessionDoc, username: string) {
    const user = Sessioning.getUser(session);
    const otherUser = await Authing.getUserByUsername(username);
    return await Messaging.getConversation(user, otherUser._id);
  }

  @Router.delete("/messages/:id")
  async deleteMessage(session: SessionDoc, id: string) {
    const oid = new ObjectId(id);
    await Messaging.removeMessage(oid);
    return { msg: "Message successfully deleted!" };
  }
}

/** The web app. */
export const app = new Routes();

/** The Express router. */
export const appRouter = getExpressRouter(app);
