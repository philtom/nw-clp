package com.fourpir.nw.clp

/**
 * User: tom
 * Date: 10/21/13
 * Time: 1:04 PM
 */
object FlagInspector extends App {
  CombatLogReader.read("data/all").map(_.flags).flatten.toSet.toList.sorted.foreach(println)
}
