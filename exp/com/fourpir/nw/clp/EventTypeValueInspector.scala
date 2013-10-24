package com.fourpir.nw.clp

/**
 * User: tom
 * Date: 10/16/13
 * Time: 4:24 PM
 */
object EventTypeValueInspector extends App {
  CombatLogReader.read("data/combatlog-20131015-fh.log").map(inspect).toSet.toList.sorted.foreach(println)

  def inspect(event: CombatEvent): String = {
    event.eventType + " is " + { event.value match {
      case 0 => "zero"
      case x if x < 0 => "negative"
      case x if x > 0 => "positive"
    }} + " with " + event.flags.toList.sorted.mkString(", ")
  }
}
