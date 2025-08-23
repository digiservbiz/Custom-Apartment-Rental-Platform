import React, { useState, useEffect } from 'react';
import { Form, FormGroup, Label, Input, Button, Col, Row } from 'reactstrap';

const AMENITIES = ['wifi', 'pool', 'kitchen', 'parking', 'gym', 'ac'];

const Filters = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    priceLte: '',
    guestsGte: '',
    amenities: [],
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFilters((prevFilters) => {
        const newAmenities = checked
          ? [...prevFilters.amenities, name]
          : prevFilters.amenities.filter((amenity) => amenity !== name);
        return { ...prevFilters, amenities: newAmenities };
      });
    } else {
      setFilters((prevFilters) => ({
        ...prevFilters,
        [name]: value,
      }));
    }
  };

  useEffect(() => {
    // Debounce the filter change to avoid too many API calls
    const handler = setTimeout(() => {
      // Construct the query parameters object
      const params = {};
      if (filters.priceLte) params['pricePerNight[lte]'] = filters.priceLte;
      if (filters.guestsGte) params['maxGuests[gte]'] = filters.guestsGte;
      if (filters.amenities.length > 0) params['amenities[in]'] = filters.amenities.join(',');

      onFilterChange(params);
    }, 500); // 500ms debounce

    return () => {
      clearTimeout(handler);
    };
  }, [filters, onFilterChange]);

  const handleReset = () => {
    setFilters({
      priceLte: '',
      guestsGte: '',
      amenities: [],
    });
  };

  return (
    <div className="p-4 mb-4" style={{ border: '1px solid #ddd', borderRadius: '8px' }}>
      <h4>Filters</h4>
      <Form>
        <Row>
          <Col md={6}>
            <FormGroup>
              <Label for="priceLte">Max Price Per Night</Label>
              <Input
                type="number"
                name="priceLte"
                id="priceLte"
                placeholder="e.g., 200"
                value={filters.priceLte}
                onChange={handleChange}
              />
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup>
              <Label for="guestsGte">Min. Guests</Label>
              <Input
                type="number"
                name="guestsGte"
                id="guestsGte"
                placeholder="e.g., 2"
                value={filters.guestsGte}
                onChange={handleChange}
              />
            </FormGroup>
          </Col>
        </Row>
        <FormGroup>
          <Label>Amenities</Label>
          <div className="d-flex flex-wrap">
            {AMENITIES.map((amenity) => (
              <FormGroup check key={amenity} className="me-3">
                <Input
                  type="checkbox"
                  name={amenity}
                  id={amenity}
                  checked={filters.amenities.includes(amenity)}
                  onChange={handleChange}
                />
                <Label for={amenity} check>
                  {amenity.charAt(0).toUpperCase() + amenity.slice(1)}
                </Label>
              </FormGroup>
            ))}
          </div>
        </FormGroup>
        <Button color="secondary" onClick={handleReset} className="mt-3">Reset Filters</Button>
      </Form>
    </div>
  );
};

export default Filters;
