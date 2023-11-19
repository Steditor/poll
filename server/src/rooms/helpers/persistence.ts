import { PollSettings as PollSettingsEntity } from "@prisma/client";
import { DateTime, DurationLike } from "luxon";

import { PollSettings as PollSettingsSchema } from "@poll/common/schema/PollSettings";

import { prisma } from "../../db.js";
import { PollSettingsSchemalike } from "../schema/PollSettings.js";

export async function persistPollSettings(
  roomId: string,
  settings: PollSettingsSchema,
) {
  await prisma.pollSettings.upsert({
    where: { roomId: roomId },
    create: Object.assign({ roomId }, schemalikeToEntity(settings)),
    update: schemalikeToEntity(settings),
  });
}

export async function updateExpiry(roomId: string) {
  const delay = await prisma.pollSettings.findUnique({
    where: { roomId },
    select: { expiryDelay: true },
  });
  let expiryDelay = ExpiryDelay.Hour;
  if (delay) {
    expiryDelay = delay.expiryDelay as ExpiryDelay;
  }
  let delayDuration: DurationLike;
  switch (expiryDelay) {
    case ExpiryDelay.Hour:
    default:
      delayDuration = { hour: 1 };
      break;
    case ExpiryDelay.Day:
      delayDuration = { day: 1 };
      break;
    case ExpiryDelay.Week:
      delayDuration = { week: 1 };
      break;
    case ExpiryDelay.Month:
      delayDuration = { month: 1 };
      break;
  }
  try {
    await prisma.pollSettings.update({
      where: { roomId },
      data: { expiry: DateTime.now().plus(delayDuration).toJSDate() },
    });
  } catch (e) {
    // ignore missing records
  }
}

export async function deleteExpired() {
  await prisma.pollSettings.deleteMany({
    where: {
      expiry: {
        lt: DateTime.now().toJSDate(),
      },
    },
  });
}

export function entityToSchemalike(
  settings: PollSettingsEntity,
): PollSettingsSchemalike {
  return {
    numberOfOptions: settings.numberOfOptions,
    numbering: settings.numbering,
    openVote: settings.openVote,
    showResults: settings.showResults,
    moderationKey: settings.moderationKey,
    expiry: DateTime.fromJSDate(settings.expiry).toISO()!,
    expiryDelay: settings.expiryDelay as ExpiryDelay,
  };
}

function schemalikeToEntity(
  settings: PollSettingsSchema,
): Omit<PollSettingsEntity, "roomId"> {
  return {
    numberOfOptions: settings.numberOfOptions,
    numbering: settings.numbering,
    openVote: settings.openVote,
    showResults: settings.showResults,
    moderationKey: settings.moderationKey,
    expiry: DateTime.fromISO(settings.expiry).toJSDate(),
    expiryDelay: settings.expiryDelay,
  };
}

export enum ExpiryDelay {
  Hour = "hour",
  Day = "day",
  Week = "week",
  Month = "month",
}
