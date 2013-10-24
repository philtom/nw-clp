package com.fourpir.nw.clp

/**
 * User: tom
 * Date: 10/13/13
 * Time: 5:22 PM
 */
case class Entity(name: String,
                  id: String) extends Named {

  val identifier: EntityIdentifier = EntityIdentifier.parse(id)
}
