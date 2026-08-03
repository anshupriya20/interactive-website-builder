import BuilderLayout from "../../components/builder/layout/BuilderLayout";

export default function BuilderProjectPage({ params }) {
    return <BuilderLayout projectId={params.projectId} />;
}
