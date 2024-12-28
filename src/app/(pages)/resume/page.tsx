'use client';

import React from 'react';
import { Container } from '@/shared/ui/Container';
import CandidateInfo from './CandidateInfo';

const page = () => {
  return (
    <div className="Candidate">
      <Container>
        <CandidateInfo />
      </Container>
    </div>
  );
};

export default page;
