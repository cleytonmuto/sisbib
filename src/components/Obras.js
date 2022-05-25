/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useMemo, useRef } from 'react';
import ObraService from '../services/obra.service';
import { useTable } from 'react-table';
import { useNavigate } from 'react-router-dom';
import { Container, Button, Form, Row, Col, Navbar, Nav, Table } from 'react-bootstrap';
import colunasObras from './resources/ColunasObras';

const Obras = (props) => {
  const limit = 20;
  const [page, setPage] = useState(1);
  const [obras, setObras] = useState([]);
  const [keyword, setKeyword] = useState('');

  const navigate = useNavigate();
  const form = useRef();
  
  useEffect(async () => {
    const awaitObras = await ObraService.getAll(limit, page);
    return setObras(awaitObras.data);
  }, [page]);

  const columns = useMemo(() => colunasObras.concat([
    {
      Header: 'Cadastro',
      accessor: 'createdAt',
      Cell: ({ row }) => (<span>{new Intl.DateTimeFormat("pt-BR", {}).format(
        new Date(row.original.createdAt))}</span>)
    }
  ]), []);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data: obras
    });
  
  const onChangeKeyword = (e) => {
    const keyword = e.target.value;
    setKeyword(keyword);
  }

  const handleSearch = (e) => {
    e.preventDefault();
    setKeyword(keyword);
    navigate('/search', { state: { termo: keyword } } );
    window.location.reload();
  };

  return (
    <Container fluid className="list row p-0">
      <Row>
        <Col md={3}>
          <Navbar className="pt-2" aria-label="Page navigation example">
            <Nav className="pagination pt-1">
              <Nav.Item className="page-item"><Button className="page-link mx-1" onClick={() => setPage(page - 1)}>Anterior</Button></Nav.Item>
              <Nav.Item className="page-item"><Button className="page-link" onClick={() => setPage(1)}>1</Button></Nav.Item>
              <Nav.Item className="page-item"><Button className="page-link" onClick={() => setPage(2)}>2</Button></Nav.Item>
              <Nav.Item className="page-item"><Button className="page-link" onClick={() => setPage(3)}>3</Button></Nav.Item>
              <Nav.Item className="page-item"><Button className="page-link" onClick={() => setPage(4)}>4</Button></Nav.Item>
              <Nav.Item className="page-item"><Button className="page-link" onClick={() => setPage(5)}>5</Button></Nav.Item>
              <Nav.Item className="page-item"><Button className="page-link mx-1" onClick={() => setPage(page + 1)}>Seguinte</Button></Nav.Item>
            </Nav>
          </Navbar>
        </Col>
        <Col>
          <Form className="d-flex" onSubmit={handleSearch} ref={form}>
            <Form.Group className="col-4 pt-4">
              <Form.Control
                type="text"
                className="form-control mt-1"
                name="termo"
                value={keyword}
                onChange={onChangeKeyword}
                placeholder="termo de busca"
              />
            </Form.Group>
            <Form.Group className="col-2 pt-4">
              <Button type="submit" className="btn btn-primary mt-1 mx-2">
                Buscar
              </Button>
            </Form.Group>
          </Form>
        </Col>
      </Row>
      
      <Container fluid className="col-md-12 list my-3">
        <Table size="sm" striped hover responsive {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th className="text-center" {...column.getHeaderProps()}>
                    {column.render('Header')}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row, i) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <td className="text-center" {...cell.getCellProps()}>
                        {cell.render('Cell')}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Container>
      <nav aria-label="Page navigation example">
        <ul className="pagination">
          <li className="page-item"><button className="page-link" onClick={() => setPage(page - 1)}>Anterior</button></li>
          <li className="page-item"><button className="page-link" onClick={() => setPage(1)}>1</button></li>
          <li className="page-item"><button className="page-link" onClick={() => setPage(2)}>2</button></li>
          <li className="page-item"><button className="page-link" onClick={() => setPage(3)}>3</button></li>
          <li className="page-item"><button className="page-link" onClick={() => setPage(4)}>4</button></li>
          <li className="page-item"><button className="page-link" onClick={() => setPage(5)}>5</button></li>
          <li className="page-item"><button className="page-link" onClick={() => setPage(page + 1)}>Seguinte</button></li>
        </ul>
      </nav>
    </Container>
  );
};

export default Obras;
