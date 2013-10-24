package com.fourpir.nw.clp

import com.fourpir.nw.clp.EntityType.EntityType

/**
 * User: tom
 * Date: 10/14/13
 * Time: 8:50 AM
 */
object EntityIdentifier {
  def parse(identifier: String): EntityIdentifier =
  {
    if (identifier.isEmpty)
      return EntityIdentifier(EntityType.None, "", "")

    val pattern = """([CP])\[(\S+) ([^]]+)]""".r
    pattern findFirstIn identifier match {
      case Some(pattern(entityType, id, name)) => EntityIdentifier(EntityType.decode(entityType), id, name)
      case None => throw new IllegalArgumentException("Invalid identifier: " + identifier)
    }
  }
}

case class EntityIdentifier(entityType: EntityType,
                            id: String,
                            name: String) extends Named {
}