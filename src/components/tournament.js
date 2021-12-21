import React, { useState, useEffect } from 'react';

import {
  Button, Container, FormControl, InputGroup, Row,
} from 'react-bootstrap';
import _ from 'lodash';
import { usePlayers, useSuspects } from '../service/players-queries';
import DataGrid from './dataGrid';
import './tournament.css';
import suspectImage from '../images/suspect.png';
import {
  ALL, PLAYER_LEVEL, ERROR_FETCHING, SEARCH, SHOW_LEVEL, TITLE,
} from '../constants/app-constants';

export default function Tournament() {
  const [searchText, setSearchText] = useState('');
  const [firstPage, setFirstPage] = useState(true);
  const [maxReach, setMaxReach] = useState(false);
  const [pageLength, setPageLength] = useState(10);
  const [pageNumber, setPageNumber] = useState(0);
  const [players, setPlayers] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState('none');
  const [totalResults, setTotalResults] = useState(0);

  const { data: suspects } = useSuspects();
  const { data: playersData, isLoading, error } = usePlayers(pageNumber, pageLength, selectedLevel, searchText);

  useEffect(() => {
    if (playersData) {
      setTotalResults(parseInt(playersData.headers['x-total'], 10));
      const playersValues = playersData.data;
      playersValues.forEach((player) => {
        player.type = suspects.includes(player.id) ? 'suspect' : 'player';
      });
      setPlayers(playersValues);
    }
  }, [playersData, suspects]);

  function getPlayers(selectedPageNumber) {
    setPageNumber(selectedPageNumber);
  }

  function goToNextPage() {
    setFirstPage(false);
    if (!maxReach) {
      (pageNumber + (2 * pageLength) >= totalResults) ? setMaxReach(true) : setMaxReach(false);
      getPlayers(pageNumber + pageLength);
      setPageNumber(pageNumber + pageLength);
    }
  }

  function goToLastPage() {
    setFirstPage(false);
    getPlayers(totalResults - pageLength);
  }

  function goToPreviousPage() {
    setMaxReach(false);
    if (pageNumber - pageLength < 0) {
      getPlayers(0);
      setFirstPage(true);
    } else {
      getPlayers(pageNumber - pageLength);
    }
  }

  function handleSelectPageLength(selectedPageLength) {
    setPageLength(parseInt(selectedPageLength.target.value, 10));
    getPlayers(pageNumber);
  }

  function handleLevelFilter(levelFilter) {
    const selectedLevelFilter = levelFilter.target.value;
    setSelectedLevel(selectedLevelFilter);
  }

  function renderPlayers() {
    if (error) {
      return <div className="error">{ERROR_FETCHING}</div>;
    }
    return (
      <Container className="p-3">
        <Container className="p-2 mb-4 rounded-3">
          <Row className="justify-content-md-center">
            <h1 className="header">{TITLE}</h1>
          </Row>
        </Container>
        <div className="App">
          <div>
            <div className="p-3 mb-4 bg-light rounded-3 tableHeader">
              <InputGroup>
                <FormControl
                  id="search"
                  placeholder={SEARCH}
                  aria-label="search"
                  aria-describedby="basic-addon2"
                  onChange={(event) => setSearchText(event.target.value.toLowerCase())}
                  value={searchText}
                />
                {searchText === '' ? null : (
                  <Button
                    variant="outline-secondary"
                    id="button-addon2"
                    onClick={() => setSearchText('')}
                  >
                    X
                  </Button>
                )}

              </InputGroup>
              <div>
                <span className="showLevel">
                  {SHOW_LEVEL}
                  {' '}
                  :
                </span>
                <select name="levelFilter" id="levelFilter" onChange={handleLevelFilter}>
                  <option key="none" value="none">{ALL}</option>
                  <option key="pro" value="pro">{PLAYER_LEVEL.PRO}</option>
                  <option key="amateur" value="amateur">{PLAYER_LEVEL.AMATEUR}</option>
                  <option key="rookie" value="rookie">{PLAYER_LEVEL.ROOKIE}</option>
                </select>
              </div>
            </div>

            <DataGrid
              headers={[
                { title: '#', field: 'id' },
                { title: 'Type', field: 'type' },
                { title: 'Name', field: 'name' },
                { title: 'Level', field: 'level' },
                { title: 'Score', field: 'score' }]}
              items={players}
              customRenderers={{
                type: (value) => (
                  <td style={{ width: '10px' }} className={value} key={value}>
                    {value === 'suspect'
                      ? <img className="img-thumbnail" alt="suspect player" src={suspectImage} />
                      : <span />}
                  </td>

                ),
                name: (value) => (
                  <td style={{ width: '40%' }} key={value}>{_.capitalize(value)}</td>
                ),
              }}
              isLoading={isLoading}
              totalResults={totalResults}
              firstPage={firstPage}
              maxReach={maxReach}
              pageNumber={pageNumber}
              pageLength={pageLength}
              goToFirstPage={() => getPlayers(0)}
              goToPreviousPage={goToPreviousPage}
              goToNextPage={goToNextPage}
              handleSelectAmountPerPage={handleSelectPageLength}
              goToLastPage={goToLastPage}
            />
          </div>
        </div>
      </Container>
    );
  }

  return <div>{renderPlayers()}</div>;
}
