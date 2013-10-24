package com.fourpir.nw.clp

import org.junit.Test
import org.junit.Assert._

/**
 * User: tom
 * Date: 10/15/13
 * Time: 8:47 AM
 */
class EntityIdentifierTest {
  @Test
  def testParse()
  {
    val identifier = EntityIdentifier.parse("P[201392709@8244681 heeme@mugwumpj]")
    assertEquals(EntityType.Player, identifier.entityType)
    assertEquals("201392709@8244681", identifier.id)
    assertEquals("heeme@mugwumpj", identifier.name)
  }

}
