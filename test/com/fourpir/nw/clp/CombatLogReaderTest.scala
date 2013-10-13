package com.fourpir.nw.clp

import org.junit.Test
import org.junit.Assert._
import org.joda.time.DateTime

/**
 * User: tom
 * Date: 10/13/13
 * Time: 1:54 PM
 */
class CombatLogReaderTest {
  @Test
  def testRead() {
    val log = CombatLogReader.read("data/Combatlog.Log")
    assertNotNull(log)
    assertTrue(log.size > 0)
  }

  @Test
  def testParseTimestamp() {
    val date = CombatLogReader.parseTimestamp("13:10:13:01:26:08.2")
    assertEquals(DateTime.parse("2013-10-13T01:26:08.200"), date)
  }

  @Test
  def testParseEvent() {
    val date = DateTime.parse("2013-10-13T01:26:08.200")
    val event = CombatLogReader.parseEvent(date, "heeme,P[201392709@8244681 heeme@mugwumpj],,*,,*,Cleave,Pn.7v71cd,Power,,-12.2115,0")
    assertNotNull(event)
  }

  @Test
  def testAsCombatEvent() {
    val event = CombatLogReader.asCombatEvent("13:10:13:01:26:08.2::heeme,P[201392709@8244681 heeme@mugwumpj],,*,,*,Health Steal,Pn.S6b30w1,HitPoints,,-5.82086,0")
    assertNotNull(event)
  }
}
