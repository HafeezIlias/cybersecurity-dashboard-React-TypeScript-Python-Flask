/**
 * Countries Table Component
 * ========================
 * 
 * Displays countries cybersecurity data in a table format
 */

import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TextField,
  Box,
  Chip,
  Typography,
} from '@mui/material';
import { Country } from '../services/api';

interface CountriesTableProps {
  countries: Country[];
}

const CountriesTable: React.FC<CountriesTableProps> = ({ countries }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<keyof Country>('Country');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (column: keyof Country) => {
    const isAsc = sortBy === column && sortDirection === 'asc';
    setSortDirection(isAsc ? 'desc' : 'asc');
    setSortBy(column);
  };

  const filteredAndSortedCountries = countries
    .filter(country =>
      country.Country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      country.Region.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];
      
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDirection === 'asc' 
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }
      
      return 0;
    });

  const getRiskColor = (riskCategory: string) => {
    switch (riskCategory) {
      case 'Low Risk': return 'success';
      case 'Medium Risk': return 'warning';
      case 'High Risk': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 2 }}>
        <TextField
          label="Search countries or regions..."
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ minWidth: 300 }}
        />
        <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
          Showing {filteredAndSortedCountries.length} of {countries.length} countries
        </Typography>
      </Box>

      <TableContainer sx={{ maxHeight: 400 }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={sortBy === 'Country'}
                  direction={sortBy === 'Country' ? sortDirection : 'asc'}
                  onClick={() => handleSort('Country')}
                >
                  Country
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortBy === 'Region'}
                  direction={sortBy === 'Region' ? sortDirection : 'asc'}
                  onClick={() => handleSort('Region')}
                >
                  Region
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">
                <TableSortLabel
                  active={sortBy === 'CEI'}
                  direction={sortBy === 'CEI' ? sortDirection : 'asc'}
                  onClick={() => handleSort('CEI')}
                >
                  CEI
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">
                <TableSortLabel
                  active={sortBy === 'GCI'}
                  direction={sortBy === 'GCI' ? sortDirection : 'asc'}
                  onClick={() => handleSort('GCI')}
                >
                  GCI
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">
                <TableSortLabel
                  active={sortBy === 'NCSI'}
                  direction={sortBy === 'NCSI' ? sortDirection : 'asc'}
                  onClick={() => handleSort('NCSI')}
                >
                  NCSI
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">
                <TableSortLabel
                  active={sortBy === 'DDL'}
                  direction={sortBy === 'DDL' ? sortDirection : 'asc'}
                  onClick={() => handleSort('DDL')}
                >
                  DDL
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortBy === 'Risk_Category'}
                  direction={sortBy === 'Risk_Category' ? sortDirection : 'asc'}
                  onClick={() => handleSort('Risk_Category')}
                >
                  Risk Category
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">
                <TableSortLabel
                  active={sortBy === 'Risk_Score'}
                  direction={sortBy === 'Risk_Score' ? sortDirection : 'asc'}
                  onClick={() => handleSort('Risk_Score')}
                >
                  Risk Score
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAndSortedCountries.map((country) => (
              <TableRow key={country.Country} hover>
                <TableCell component="th" scope="row">
                  <Typography variant="body2" fontWeight="medium">
                    {country.Country}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="textSecondary">
                    {country.Region}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  {typeof country.CEI === 'number' ? country.CEI.toFixed(3) : 'N/A'}
                </TableCell>
                <TableCell align="right">
                  {typeof country.GCI === 'number' ? country.GCI.toFixed(1) : 'N/A'}
                </TableCell>
                <TableCell align="right">
                  {typeof country.NCSI === 'number' ? country.NCSI.toFixed(1) : 'N/A'}
                </TableCell>
                <TableCell align="right">
                  {typeof country.DDL === 'number' ? country.DDL.toFixed(1) : 'N/A'}
                </TableCell>
                <TableCell>
                  <Chip
                    label={country.Risk_Category}
                    size="small"
                    color={getRiskColor(country.Risk_Category) as any}
                    variant="outlined"
                  />
                </TableCell>
                <TableCell align="right">
                  {typeof country.Risk_Score === 'number' ? 
                    (country.Risk_Score * 100).toFixed(1) + '%' : 'N/A'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default CountriesTable; 