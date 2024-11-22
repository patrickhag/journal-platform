import ArticleSubmitionForm from "@/components/upload/ArticleSubmitionForm";
import FileUpload from "@/components/upload/file-upload";
import FinalSubmissionForm from "@/components/upload/FinalSubmition";
import MetadataForm from "@/components/upload/metadata-form";
import Reviewer from "@/components/upload/Reviewer";

export const newJournal = ({
    start: <ArticleSubmitionForm />,
    'Attach files': <FileUpload />,
    'Enter metadata': <MetadataForm />,
    Reviewers: <Reviewer />,
    'Final submit': <FinalSubmissionForm />,
})

export type TNewJournal = keyof typeof newJournal