import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import '@finance-inzicht/design-system/styles.css';
import {
  Alert,
  Button,
  Checkbox,
  Container,
  Input,
  Metric,
  PageHeader,
  Stack,
} from '@finance-inzicht/react';
function App() {
  const [name, setName] = useState('React consumer');
  return (
    <Container size="narrow">
      <Stack gap="6">
        <PageHeader
          eyebrow="React example"
          heading="Thin typed adapters"
          description="React renders the same ds-* Web Components."
        />
        <Metric
          label="Current value"
          value={name}
          tone="accent"
          detail="Updated by a typed custom event"
        />
        <Input
          label="Display name"
          value={name}
          onDsInput={(event) => setName(event.detail.value)}
        />
        <Checkbox checked onDsChange={(event) => console.info('checked', event.detail.checked)}>
          Enabled
        </Checkbox>
        <Button onClick={() => setName('Saved consumer')}>Save</Button>
        <Alert tone="success" heading="Shared implementation">
          No React component owns visual behavior.
        </Alert>
      </Stack>
    </Container>
  );
}
createRoot(document.getElementById('root')!).render(<App />);
