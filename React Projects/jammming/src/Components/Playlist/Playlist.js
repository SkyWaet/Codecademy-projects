import React from "react";
import './Playlist.css';
import TrackList from "../TrackList/TrackList";

class Playlist extends React.Component{
    render() {
        return(
            <div className="Playlist">
                <input value="New Playlist"/>
                <TrackList tracks={this.props.playlistTracks} isRemoval={true} onRemove={this.props.onRemove}></TrackList>
                <button className="Playlist-save">SAVE TO SPOTIFY</button>
            </div>
        )
    }
}
export default Playlist;