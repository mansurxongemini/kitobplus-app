import React, { useState, useRef } from "react";
import { Button, useTheme } from "@mui/material";
import PostAddIcon from "@mui/icons-material/PostAdd";
import PageShell, { PageHeader } from "../ds/components/PageShell";
import Container from "../ds/components/Container";
import NewsSection from "./NewsSection";
import NewsModalGP from "./NewsModalGP";
import useLibrary from "../LibraryContext";
import T from "../lib/translator";

const News = () => {
  const { kp } = useTheme();
  const { isAdmin } = useLibrary();
  const [editOpen, setEditOpen] = useState(false);
  const reloadRef = useRef(null);

  const actions = isAdmin ? (
    <Button
      variant="contained"
      size="medium"
      startIcon={<PostAddIcon />}
      onClick={() => setEditOpen(true)}
    >
      {T("Добавить новость")}
    </Button>
  ) : null;

  return (
    <PageShell title={T("Новости")}>
      <PageHeader
        title={T("Новости")}
        crumbs={[{ label: T("Новости") }]}
        actions={actions}
      />
      <Container sx={{ py: { xs: 5, md: 8 } }}>
        <NewsSection per_page={0} onReloadRef={reloadRef} />
      </Container>
      {isAdmin && (
        <NewsModalGP
          newsId={0}
          open={editOpen}
          onClose={() => setEditOpen(false)}
          onSaveSuccess={() => {
            setEditOpen(false);
            if (reloadRef.current) reloadRef.current();
          }}
        />
      )}
    </PageShell>
  );
};

export default News;