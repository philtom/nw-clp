package com.fourpir.nw.clp

import org.joda.time.DateTime

/**
 * User: tom
 * Date: 10/13/13
 * Time: 1:30 PM
 */
case class CombatEvent(timestamp: DateTime,
                       owner: CombatCharacter,
                       source: CombatCharacter,
                       target: CombatCharacter,
                       event: CombatAction,
                       eventType: String,
                       flags: Set[String],
                       value: Double,
                       baseValue: Double) {
  override def toString: String = {
    val sb = new StringBuilder("CombatEvent {")
    def append(label: String, value: Any) = sb.append(" ").append(label).append(": ").append(value)
    append("timestamp", timestamp)
    append("owner", owner.name)
    append("source", source.name)
    append("target", target.name)
    append("event", event.name)
    append("type", eventType)
    append("flags", "{ " + flags.toList.sorted.mkString(", ") + " }")
    append("value", value)
    append("baseValue", baseValue)
    sb.append(" }")
    sb.toString()
  }
}
