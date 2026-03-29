import styles from '@/styles/Contact.module.css'

export default function Contact() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <p className={styles.label}>Get in touch</p>
        <h2 className={styles.title}>Let's work<br />together</h2>
        <a href="mailto:hello@modernify.com" className={styles.email}>
          hello@modernify.com
        </a>
      </div>
    </section>
  )
}
