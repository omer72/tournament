import { Pagination, Table } from 'react-bootstrap';
import './dataGrid.css';
import { FIRST, LAST } from '../constants/app-constants';
import FetchingIndicator from './fetching-indicator';

export default function DataGrid(props) {
  function renderRow(item) {
    return (
      <tr key={`item_row-${item.id}`}>
        {props.headers.map((headerProperty) => {
          const customRenderer = props.customRenderers?.[headerProperty.field];
          if (customRenderer) {
            return customRenderer(item[headerProperty.field]);
          }
          return (
            <td key={`item_element-${item.id}-${headerProperty.field}`}>{item[headerProperty.field]}</td>
          );
        })}
      </tr>
    );
  }

  function renderHeaders() {
    return props.headers.map((header) => (
      <th key={header.title}>{header.title}</th>
    ));
  }

  return (
    <>
      <div className="dataGridPagination">
        <div className="dropdown" role="button">
          <span
            className="navigation"
          >
            {props.pageNumber}
            {' '}
            -
            {' '}
            {props.pageNumber + props.pageLength}
            {' '}
            of
            {' '}
            {props.totalResults}
          </span>
          <div className="dropdown-content">
            <span onClick={props.goToFirstPage} disabled={props.firstPage}>{FIRST}</span>
            <span onClick={props.goToLastPage} disabled={props.maxReach}>{LAST}</span>
          </div>
        </div>
        <Pagination size="sm">
          <Pagination.Prev disabled={props.firstPage} onClick={props.goToPreviousPage} />
          <Pagination.Next disabled={props.maxReach} onClick={props.goToNextPage} />
        </Pagination>
      </div>
      <Table striped bordered hover responsive size="sm">
        <thead>
          <tr>
            {renderHeaders()}
          </tr>
        </thead>
        {props.isLoading
          ? (
            <tbody>
              <tr><td colSpan={5} className="loading"><FetchingIndicator /></td></tr>
            </tbody>
          ) : (
            <tbody>
              {props.items.map(renderRow)}
            </tbody>
          )}

      </Table>
      <div className="footer">
        <div>
          <span className="labels">Show</span>
          <select name="amountPerPage" id="amountPerPage" onChange={props.handleSelectAmountPerPage}>
            <option key="10" value="10">10</option>
            <option key="20" value="20">20</option>
            <option key="30" value="50">50</option>
            <option key="40" value="100">100</option>
          </select>
          <span className="labels">Entries</span>
        </div>
      </div>
    </>
  );
}
