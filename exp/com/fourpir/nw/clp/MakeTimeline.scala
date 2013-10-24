package com.fourpir.nw.clp

import org.joda.time.{DateTime, Seconds}
import scala.collection.immutable.HashMap

/**
 * User: tom
 * Date: 10/15/13
 * Time: 10:22 AM
 */
object MakeTimeline extends App {
  val events = CombatLogReader.read("data/combatlog-20131014.log").toList
  val eventsBySecond = (events foldLeft HashMap[DateTime, List[CombatEvent]]()) {
    (map: HashMap[DateTime, List[CombatEvent]], event: CombatEvent) =>
      val ts = event.timestamp.withMillisOfSecond(0)
      val es = map.getOrElse(ts, List[CombatEvent]())
      map + (ts -> (es :+ event))
  }

  val firstDate = events.head.timestamp.withSecondOfMinute(0).withMillisOfSecond(0)
  val lastDate = events.last.timestamp.plusMinutes(1).withSecondOfMinute(0).withMillisOfSecond(0)
  0 until Seconds.secondsBetween(firstDate, lastDate).getSeconds foreach {
    seconds =>
      val ts = firstDate.plusSeconds(seconds)
      println(ts)
      eventsBySecond.getOrElse(ts, Nil) foreach println
  }
}
