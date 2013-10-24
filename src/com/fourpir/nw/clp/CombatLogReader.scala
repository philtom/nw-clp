package com.fourpir.nw.clp

import scala.io.Source
import java.util.logging.Logger
import org.joda.time.DateTime

/**
 * User: tom
 * Date: 10/13/13
 * Time: 1:29 PM
 */
object CombatLogReader {
  val logger = Logger.getLogger(this.getClass.getName)

  def read(filename: String): Iterator[CombatEvent] = {
    Source.fromFile(filename).getLines().map(asCombatEvent).filter(_ != null)
  }

  private[clp] def asCombatEvent(line: String): CombatEvent = {
    val Array(time, event) = line.split("::")
    val timestamp = parseTimestamp(time)
    parseEvent(timestamp, event)
  }

  private[clp] def parseTimestamp(line: String): DateTime = {
    val Array(year, month, day, hour, minute, second) = line.split(":")
    DateTime.parse("20" + year + "-" + month + "-" + day + "T" + hour + ":" + minute + ":" + second)
  }

  private[clp] def parseEvent(timestamp: DateTime, line: String): CombatEvent = {
    val Array(ownerName, ownerId, sourceName, sourceId, targetName, targetId, eventName, eventId, eventType, flags, value, baseValue) = line.split(",")
    val owner = new Entity(ownerName, ownerId)
    def resolveCharacter(name: String, id: String): Entity = {
      if (id == "*")
        owner
      else
        new Entity(name, id)
    }

    CombatEvent(
      timestamp,
      owner,
      resolveCharacter(sourceName, sourceId),
      resolveCharacter(targetName, targetId),
      CombatAction(eventName, eventId),
      eventType,
      flags.split('|').toSet,
      value.toDouble,
      baseValue.toDouble)
  }
}
