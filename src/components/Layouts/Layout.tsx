import React from 'react'
import styles from './layout.module.scss'
import Header from './Header'
import Footer from './Footer'

export default ({ children }: any) => (
  <div className={styles.page}>
    <Header />
    <div className={styles.main}>
      {children}
    </div>
    <Footer />
  </div>
)