package com.fourpir.nw.clp

import EntityType._
import scala.collection.mutable

/**
 * User: tom
 * Date: 10/15/13
 * Time: 7:15 AM
 */
object DamageCounter extends App {
  val events = CombatLogReader.read("data/combatlog-20131015-fh.log").toList

  def sourceEventsFor(entity: Entity) = events.filter(_.source == entity)

  def ownerEventsFor(entity: Entity) = events.filter(_.owner == entity)

  val sources = events.map(_.source).toSet
  val owners = events.map(_.owner).toSet
  val targets = events.map(_.target).toSet
  val entities = sources ++ owners ++ targets
  entities.filter(_.identifier == null) foreach println
  val players = entities.filter(_.identifier.entityType == Player)
  val npcs = entities.filter(_.identifier.entityType == Npc)

  players.foreach {
    player =>
      println(player)
      // source damage doesn't include everything.   use owner damage instead
      //val damage = sourceEventsFor(player).map(getDamage).sum
      //println(damage.toInt)
      val owner = ownerEventsFor(player).map(getDamage).sum
      println(owner.toInt)
      val sumByType = (ownerEventsFor(player).filterNot(_.flags.contains("ShowPowerDisplayName")) foldLeft mutable.HashMap[String, Double]()) {
        (map, event) =>
          val key = event.event.name + " " + event.eventType
          val sum = map.getOrElse(key, 0.0) + event.baseValue
          map.put(key, sum)
          map
      }
      sumByType foreach (e => println(e._1.replace(' ', '_') + " " + e._2.toInt))
  }

  def getDamage(event: CombatEvent): Double = {
    event.eventType match {
      case "HitPoints" => 0
      case "Null" => 0
      case "Physical" => event.value // damage
      case "Power" => event.value // not sure what these numbers are.  they all appear to be negative
      case "Radiant" => event.value // DC damage
      case "KnockBack" => 0 // possibly only seen with the Immune flag
      case "SpeedRunning" => 0 // possibly only seen with the Immune flag
      case "Repel" => 0 // possibly only seen with the Immune flag
      case "Cold" => event.value // CW damage
      case "Arcane" => event.value // CW damage
      case "Hold" => 0 // possibly only seen with the Immune flag
      case "CritSeverity" => 0 // only for Deadly Momentum display??
      case "Fire" => event.value // plague fire
      case "PowerMode" => 0 // only injury display?
      case "SpeedRecharge" => 0 // when using injury kit?
      case "HitPointsMax" => 0 // related to injuries
      case "DamageSetAll" => 0 // related to injuries
      case "PowerRecharge" => 0 // display for Dazzling Blades
      case "CombatAdvantage" => 0 // possilby only seen with Immune or ShowPowerDisplayName
      case "Disable" => 0 // possilby only seen with Immune
      case "Stamina" => 0 // power display
      case "KnockUp" => 0 // possibly only seen with Immune
      case "Lightning" => event.value // CW sudden storm.  owner, not source
      case "NoCollision" => 0 // CW Phantasm Immune
      case "ConstantForce" => 0 // CW phantasm immune
      case "CritChance" => 0 // for display
      case "Shield" => event.value // negative damage to negate damage done that got blocked
      case "Root" => 0 // only shown with Immune
      case "AttribModExpire" => 0 // display
      case "Necrotic" => event.value // Tenebrous Power
      case "PerceptionStealth" => 0 // Immune
      case "Poison" => event.value // Not sure how to count this.  The owner, source, and target are all the same.  And it's poison damage.  Should it really count towards a person's damage?
      case _ =>
        println(event)
        0
    }
  }
}
