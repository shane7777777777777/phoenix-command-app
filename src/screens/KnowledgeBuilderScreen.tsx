import React from 'react';
import KnowledgeBuilder from '../components/KnowledgeBuilder';

interface KnowledgeBuilderScreenProps {
  getApiToken?: () => Promise<string>;
}

const KnowledgeBuilderScreen: React.FC<KnowledgeBuilderScreenProps> = ({ getApiToken }) => (
  <KnowledgeBuilder getApiToken={getApiToken} />
);

export default KnowledgeBuilderScreen;
