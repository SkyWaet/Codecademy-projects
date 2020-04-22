import React from 'react';

import './App.css';
import SearchBar from '../SearchBar/SearchBar'
import SearchResults from '../SearchResults/SearchResults'
import Playlist from '../Playlist/Playlist'

class App extends React.Component{
    constructor(props) {
        super(props);
        this.addTrack = this.addTrack.bind(this);
        this.removeTrack=this.removeTrack.bind(this);
        this.state = {searchResults: [{id:1,name:"Name", artist: "Artist", album:"Album"},{id:2,name:"Name", artist: "Artist", album:"Album"}], playlistName:"Name", playlistTracks:[{id:1,name:"Name", artist: "Artist", album:"Album"}]}
    }
    addTrack(track){
        let tracks = this.state.playlistTracks;
        let isFound = tracks.find(elem=>{
            if(track.id===elem.id) return;
        })
        if(!isFound){
            this.setState({playlistTracks: tracks.push(track)});
        }
    }

    removeTrack(track){
        let updatedPlaylist = this.state.playlistTracks.filter(elem=>elem.id!=track.id);
        this.setState({playlistTracks: updatedPlaylist});
    }

    render() {
       return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar />
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack}/>
            <Playlist playlistName={this.state.playlistName} playlistTracks={this.state.playlistTracks} onRemove={this.removeTrack}/>
          </div>
        </div>
      </div>
    );
    }

}

export default App;
