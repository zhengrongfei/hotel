import styles from './style.module.css'
import pic from './pic.jpeg'

const listItem = [
  {
    picUrl: pic,
    title: 'Discover more rewarding stays at participating Park Hyatt hotels',
    desc: 'Earn 2,000 Bonus Points per qualifying stay at several participating Park Hyatt hotels in Asia Pacific and North America from December 21, 2022 to February 28, 2023. Terms apply.',
  },
  {
    picUrl: pic,
    title: 'Discover more rewarding stays at participating Park Hyatt hotels',
    desc: 'Earn 2,000 Bonus Points per qualifying stay at several participating Park Hyatt hotels in Asia Pacific and North America from December 21, 2022 to February 28, 2023. Terms apply.',
  },
  {
    picUrl: pic,
    title: 'Discover more rewarding stays at participating Park Hyatt hotels',
    desc: 'Earn 2,000 Bonus Points per qualifying stay at several participating Park Hyatt hotels in Asia Pacific and North America from December 21, 2022 to February 28, 2023. Terms apply.',
  },
  {
    picUrl: pic,
    title: 'Discover more rewarding stays at participating Park Hyatt hotels',
    desc: 'Earn 2,000 Bonus Points per qualifying stay at several participating Park Hyatt hotels in Asia Pacific and North America from December 21, 2022 to February 28, 2023. Terms apply.',
  },
]

const Courses = () => {
  return (
    <div className={styles.courses}>
      <ul className={styles.list}>
        {listItem.map((item, index) => {
          return (
            <li className={styles.item} key={index}>
              <img className={styles.img} src={item.picUrl} alt="pic" />
              <div className={styles.text}>
                <h3 className={styles.title}>{item.title}</h3>
                <hr className={styles.line} />
                <p className={styles.desc}>{item.desc}</p>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default Courses
