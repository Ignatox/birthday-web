import { siteConfig } from "@/config/site";
import { displayFont } from "@/lib/fonts";
import styles from "./HeroContent.module.css";

export function HeroContent() {
  const { event, ageTurning } = siteConfig;
  const mapsHref = event.mapsUrl || undefined;

  return (
    <div className={styles.overlay}>
      <h1 className={`${styles.title} ${displayFont.className}`}>
        Te invito a mi <span className={styles.highlight}>cumpleaños</span>{" "}
        <span className={styles.badge}>N°{ageTurning}</span>
      </h1>

      <div className={styles.details}>
        <div className={`${styles.chipRow} ${displayFont.className}`}>
          <span className={`${styles.chip} ${styles.chipCyan}`}>
            {event.date}
          </span>
          <span className={`${styles.chip} ${styles.chipPurple}`}>
            {event.time}
          </span>
          <span className={`${styles.chip} ${styles.chipPink}`}>
            {event.location}
          </span>
        </div>

        {mapsHref ? (
          <a
            className={styles.mapsLink}
            href={mapsHref}
            target="_blank"
            rel="noreferrer"
          >
            click para ubicación
          </a>
        ) : (
          <span className={styles.mapsPending}>click para ubicación</span>
        )}
      </div>
    </div>
  );
}
