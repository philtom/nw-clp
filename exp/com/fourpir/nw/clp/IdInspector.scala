package com.fourpir.nw.clp

import scala.collection.mutable

/**
 * User: tom
 * Date: 10/14/13
 * Time: 8:24 AM
 */
object IdInspector extends App {
  val ids = mutable.HashSet[String]()
  CombatLogReader.read("data/combatlog-20131013.log") foreach
  {
    event =>
      ids += event.source.id
      ids += event.target.id
      ids += event.owner.id
  }

  ids.toList.sorted foreach println
}
