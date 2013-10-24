package com.fourpir.nw.clp

import org.joda.time.{Seconds, DateTime}
import scala.collection.mutable

/**
 * User: tom
 * Date: 10/14/13
 * Time: 2:24 PM
 */
object DpsTracker extends App {
  val queue = mutable.Buffer[CombatEvent]()
  var total = 0.0
  var count = 0
  CombatLogReader.read("data/combatlog-20131014.log")
  .filter(_.source.name == "heeme")
  .filterNot(_.eventType == "HitPoints")
  .filterNot(_.eventType == "Power")
  .filterNot(_.eventType == "Null")
  .foreach
  {
    event =>
      queue.append(event)
      while (queue.size > 1 && Seconds.secondsBetween(queue.head.timestamp, event.timestamp).getSeconds > 1)
        queue.remove(0)
      val dps = queue.map(_.value).sum
      println(event.timestamp + " " + dps + " " + event.eventType)
      total += event.value
      count += 1
  }

  println(total)
}
