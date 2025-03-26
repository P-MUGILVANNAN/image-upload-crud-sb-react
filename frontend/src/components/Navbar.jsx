import React from 'react'
import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav class="navbar navbar-expand bg-black">
        <div class="container-fluid">
            <a href="/" class="navbar-brand text-light">Product CRUD SB + React</a>
        </div>
    </nav>
  )
}

export default Navbar