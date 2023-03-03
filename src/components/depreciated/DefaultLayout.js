import MainNavigation from './NavBar';
import classes from './DefaultLayout.module.css';

function DefaultLayout(props) {
  return (
    <div>
      <MainNavigation />
      <main className={classes.main}>{props.children}</main>
    </div>
  );
}

export default DefaultLayout;