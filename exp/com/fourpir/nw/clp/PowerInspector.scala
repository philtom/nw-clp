package com.fourpir.nw.clp

import scala.collection.mutable

/**
 * User: tom
 * Date: 10/26/13
 * Time: 2:10 PM
 */
object PowerInspector extends App {
  val events = mutable.HashMap[String, (Int, Double)]();
  CombatLogReader.read("data/all").foreach
  {
    log =>
      val key = log.eventType + " " + log.event.name + " " + log.event.id
      val (count, total) = events.getOrElse(key, (0, 0.0))
      events.put(key, (count + 1, total + log.value))
  }
  events.toList.map
  {
    case (name: String, (count: Int, total: Double)) =>
      name + " " + count + " " + total / count
  }.sorted.foreach(println)
}
