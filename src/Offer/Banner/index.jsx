
import styles from './style.module.css';
import image from './bg.jpeg';

const Banner = () => {
  return (
    <div className={styles.banner}>
      <img className={styles.img} src={image} alt="banner" />
      <div className={styles.text}>
        <div className={styles.title}>Your travel adds up to even more</div>
        <div className={styles.description}>Offers that go beyond the expected. For experiences that do the same.</div>
      </div>
    </div>
  );
}

export default Banner;
