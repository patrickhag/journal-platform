import ArticleSubmitionForm from "@/components/upload/ArticleSubmitionForm";
import FileUpload from "@/components/upload/file-upload";
import MetadataForm from "@/components/upload/metadata-form";
import Reviewer from "@/components/upload/Reviewer";

export const newJournal = ({
    start: <ArticleSubmitionForm/>,
    'Attach files': <FileUpload />,
    'Enter metadata': <MetadataForm />,
    Reviewers: <Reviewer />,
    'Final submit': <>Final</>,
})

export type TNewJournal = keyof typeof newJournal