package com.fourpir.nw.clp

/**
 * User: tom
 * Date: 10/14/13
 * Time: 8:45 AM
 */
object EntityType extends Enumeration {
  type EntityType = Value
  val None, Npc, Player = Value

  def decode(code: String): EntityType = {
    code match {
      case "C" => Npc
      case "P" => Player
      case "" => None
      case _ => throw new NoSuchElementException("Unknown entity type code " + code)
    }
  }
}
