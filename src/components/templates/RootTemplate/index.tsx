import React, {memo, ReactNode} from "react";
import classes from './styles.module.scss';

export interface RootTemplateProps {
  header?: ReactNode,
  body?: ReactNode,
  player?: ReactNode,
  progressBar?: ReactNode,
  musicWave?: ReactNode,
  footer?: ReactNode,
  backgroundLayer?: ReactNode,
}

function RootTemplate(props: RootTemplateProps) {

  return (
    <main className={classes.root}>
      <div className={classes.backgroundLayer}>{props.backgroundLayer}</div>
      <div className={classes.sectionsContainer}>
        <section>{props.header}</section>
        <section style={{ marginTop: 13 }}>{props.body}</section>
        <section style={{ marginTop: 38 }}>{props.player}</section>
        <section style={{ marginTop: 35 }}>{props.progressBar}</section>
        <section style={{ flex: 1, marginTop: 15, }} />
        <section className={classes.footer}>
          {props.musicWave}
          {props.footer}
        </section>
      </div>
    </main>
  );
}

export default memo(RootTemplate);