package com.fourpir.nw.clp

import scala.collection.mutable
import org.joda.time.{DateTime, Seconds}

/**
 * User: tom
 * Date: 10/14/13
 * Time: 5:50 PM
 */
object EventGrouper extends App {
  val diffs = mutable.Buffer[Int]()
  var lastTimestamp: DateTime =  null

  CombatLogReader.read("data/combatlog-20131013.log")
  .filter(_.source.name == "heeme")
  .filter(_.eventType != "Hitpoints")
  .filter(_.eventType != "Null")
  .foreach
  {
    event =>
      if (lastTimestamp != null)
        diffs += Seconds.secondsBetween(lastTimestamp, event.timestamp).getSeconds
      lastTimestamp = event.timestamp
  }

  (diffs foldLeft mutable.HashMap[Int, Int]()) {
    (counts: mutable.HashMap[Int, Int], diff: Int) =>
      counts += diff -> (counts.getOrElse(diff, 0) + 1)
  }.toList.sorted foreach println

}
