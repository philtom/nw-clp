package com.fourpir.nw.clp

import java.util.logging.Logger
import scala.collection.mutable

/**
 * User: tom
 * Date: 10/13/13
 * Time: 2:41 PM
 */
object ExamineLog extends App {
  val logger = Logger.getAnonymousLogger
  val owners = mutable.HashMap[String, Int]()
  val sources = mutable.HashMap[String, Int]()
  val targets = mutable.HashMap[String, Int]()
  val events = mutable.HashMap[String, Int]()
  val types = mutable.HashMap[String, Int]()
  val flags = mutable.HashMap[String, Int]()

  val logs = CombatLogReader.read("data/combatlog-20131014.log")
  logs foreach {
    log =>
      log.flags foreach (f => if (f.nonEmpty) flags.put(f, flags.getOrElse(f, 0) + 1))
      types.put(log.eventType, types.getOrElse(log.eventType, 0) + 1)
      events.put(log.event.name, events.getOrElse(log.event.name, 0) + 1)
      targets.put(log.target.name, targets.getOrElse(log.target.name, 0) + 1)
      owners.put(log.owner.name, owners.getOrElse(log.owner.name, 0) + 1)
      sources.put(log.source.name, sources.getOrElse(log.source.name, 0) + 1)
  }

  println("owners")
  owners foreach println

  println("sources")
  sources foreach println

  println("targets")
  targets foreach println

  println("events")
  events foreach println

  println("types")
  types foreach println

  println("flags")
  flags foreach println
}
