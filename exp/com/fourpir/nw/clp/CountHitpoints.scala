package com.fourpir.nw.clp

/**
 * User: tom
 * Date: 10/13/13
 * Time: 5:59 PM
 */
object CountHitpoints extends App {
  var hp: Double = 0

  // This doesn't seem to work.   Overheals are not reported.  So, hp keeps going up
  CombatLogReader.read("data/combatlog-20131013.log").filterNot(_.eventType == "Power") foreach {
    event =>
      if (event.target.name == "heeme") {
        hp -= event.value
        println(event.timestamp + " " + event.eventType + " " + hp + " " + event)
      }
  }
}
