import { PollSettings as PollSettingsEntity } from "@prisma/client";
import { DateTime, DurationLike } from "luxon";

import { ExpiryDelay } from "@poll/common/roomInterface";
import { PollSettings as PollSettingsSchema } from "@poll/common/schema/PollSettings";

import { prisma } from "../../db.js";
import { PollSettingsSchemalike } from "../schema/PollSettings.js";

export async function persistPollSettings(
  roomId: string,
  settings: PollSettingsSchema,
) {
  await prisma.pollSettings.upsert({
    where: { roomId },
    create: Object.assign({ roomId }, schemalikeToEntity(settings)),
    update: schemalikeToEntity(settings),
  });
}

export async function computeExtendedExpiry(
  delay: ExpiryDelay,
): Promise<string> {
  let delayDuration: DurationLike;
  switch (delay) {
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
  return DateTime.now().plus(delayDuration).toISO()!;
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
