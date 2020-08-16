import * as React from 'react';
import classes from './styles.module.scss';
import {Component} from "react";
import {Song} from "../../../redux-store/features/player/types";
import {Cover} from "../../atoms/Cover";
import Carousel from '@brainhubeu/react-carousel';
import '@brainhubeu/react-carousel/lib/style.css';
import {coversCarouselSettings, titlesCarouselSettings} from "./carousel-settings";
import SongTitle from "../../molecules/SongTitle";
import {MAX_ROOT_WIDTH} from "../../../utils/constans";

const coverSize = Math.floor(MAX_ROOT_WIDTH * 0.56);

export interface CoversSliderProps {
  previousSongs: number[],
  nextSongs: number[],
  currentSong: number,
  songs: Song[],
  playSpecifiedSong: (nextSongId: number) => void,
}
export interface CoversSliderState {
  cache: Song[],
  currentSlideIndex: number,
}

class CoversSlider extends Component<CoversSliderProps, CoversSliderState> {
  constructor(props: CoversSliderProps) {
    super(props);
    this.findSongById = this.findSongById.bind(this);
    this.generateCache = this.generateCache.bind(this);
    this.renderCover = this.renderCover.bind(this);
    this.onSlideChange = this.onSlideChange.bind(this);
    this.renderTitle = this.renderTitle.bind(this);

    const cache = this.generateCache();
    const currentSlideIndex = cache.indexOf(this.findSongById(this.props.currentSong));
    this.state = {
      cache, currentSlideIndex
    };
  }

  componentDidUpdate(prevProps: Readonly<CoversSliderProps>) {
    if(
      prevProps.previousSongs !== this.props.previousSongs
      || prevProps.previousSongs.length !== this.props.previousSongs.length
      || prevProps.currentSong !== this.props.currentSong
      || prevProps.nextSongs.length !== this.props.nextSongs.length
      || prevProps.nextSongs !== this.props.nextSongs
    ) {
      const cache = this.generateCache();
      const currentSlideIndex = cache.indexOf(this.findSongById(this.props.currentSong));
      this.setState({
        cache, currentSlideIndex
      });
    }
  }

  private findSongById(songId: number): Song {
    return this.props.songs.find(song => song.id === songId) as Song;
  }
  private generateCache(): Song[] {
    const {previousSongs, currentSong, nextSongs} = this.props;
    let cache: Song[] = [];
    cache = cache.concat(previousSongs.map(
      (songId: number) => this.findSongById(songId)
    ));
    cache.push(this.findSongById(currentSong));
    cache = cache.concat(nextSongs.map(
      (songId: number) => this.findSongById(songId)
    ));
    return cache;
  }
  private renderCover(song: Song, index: number) {
    return (
      <Cover
        key={song.id + ':' + index}
        song={song}
        enlarge={this.props.currentSong === song.id}
      />
    );
  }
  private async onSlideChange(index: number): Promise<void> {
    const songId = this.state.cache[index].id;
    await this.props.playSpecifiedSong(songId);
  }
  private renderTitle(song: Song, index: number) {
    return (
      <SongTitle
        key={song.id + ':' + index + '-title'}
        song={song}
        visible={this.props.currentSong === song.id}
      />
    );
  }

  render() {
    const {cache, currentSlideIndex} = this.state;

    return (
      <div className={classes.root}>
        <Carousel
          itemWidth={coverSize}
          offset={-32}
          value={currentSlideIndex}
          onChange={this.onSlideChange}
          {...coversCarouselSettings}
        >
          {cache.map(this.renderCover)}
        </Carousel>

        <div className={classes.divider} />

        <Carousel
          itemWidth={coverSize}
          offset={-32}
          value={currentSlideIndex}
          onChange={this.onSlideChange}
          {...titlesCarouselSettings}
        >
          {cache.map(this.renderTitle)}
        </Carousel>
      </div>
    );
  }
}

export default CoversSlider;