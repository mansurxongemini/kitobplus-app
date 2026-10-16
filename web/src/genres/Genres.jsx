import React from "react";
import PageShell, { PageHeader } from "../ds/components/PageShell";
import GenresView from "./GenresView";
import T from "../lib/translator";

const Genres = () => {
  return (
    <PageShell title={T("Жанры")}>
      <PageHeader
        title={T("Жанры")}
        crumbs={[{ label: T("Жанры") }]}
      />
      <GenresView />
    </PageShell>
  );
};

export default Genres;
