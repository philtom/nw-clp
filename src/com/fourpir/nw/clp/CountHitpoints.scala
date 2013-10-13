package com.fourpir.nw.clp

/**
 * User: tom
 * Date: 10/13/13
 * Time: 5:59 PM
 */
object CountHitpoints extends App {
  var hp: Double = 0

  CombatLogReader.read("data/Combatlog.Log") foreach {
    event =>
      if (event.target.name == "heeme") {
        hp -= event.value
        println(event.timestamp + " " + hp + " " + event)
      }
  }
}
