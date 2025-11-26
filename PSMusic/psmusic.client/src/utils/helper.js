import React, { useState, useEffect, useMemo } from "react";

const artistsForView = useMemo(
        () => (activeTab === "T?t c?" ? artists.slice(0, 4) : artists),
        [artists, activeTab]
    );

    const handlePageChange = (newPage) => {
        setPage(newPage);
        const newParams = Object.fromEntries(params.entries());
        newParams.page = newPage.toString();
        setParams(newParams);
    };

    const handleTabChange = (tabLabel) => {
        setActiveTab(tabLabel);
        const newType = TAB_TO_TYPE[tabLabel] || "all";

        const newParams = Object.fromEntries(params.entries());
        newParams.t = newType;
        newParams.page = "1";
        setParams(newParams);
    };

    const handleTitleClick = (song) => {
        navigate(`/song/${song.id}`);
    };

    const handleAddToPlaylist = (song, playlist) => {
        if (playlist.id === "new") {
            // m? modal t?o playlist
        } else {
            // call API add vào playlist.id
        }
    };

    const handleViewArtist = (artistName) => {
        navigate(`/artist/${encodeURIComponent(artistName)}`);
    };