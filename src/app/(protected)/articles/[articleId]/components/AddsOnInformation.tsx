import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { StudyInformation } from '@/types/study-information';

interface AddsOnInformationProps {
  data: StudyInformation;
  title?: string;
  description?: string;
}

const AddsOnInformation: React.FC<AddsOnInformationProps> = ({
  data,
  title = 'Study Information',
  description = 'Additional study details and compliance information',
}) => {
  const questions = [
    {
      id: 'funded',
      question: 'Was this study funded?',
      answer: data.funded,
      required: true,
      description: 'Indicates whether the study received external funding',
    },
    {
      id: 'informedConsent',
      question: 'Has this study provided informed consent?',
      answer: data.informedConsent,
      required: false,
      description: 'Confirms that participants provided informed consent',
    },
    {
      id: 'ethicalClearance',
      question: 'Was this study given an ethical clearance?',
      answer: data.ethicalClearance,
      required: true,
      description: 'Verifies that the study received ethical approval',
    },
    {
      id: 'humanParticipation',
      question:
        'Has this study included Human part such as blood samples, tissues?',
      answer: data.humanParticipation,
      required: true,
      description: 'Indicates if the study involved human biological samples',
    },
  ];

  const getStatusIcon = (answer: boolean) => {
    return answer ? (
      <CheckCircle className="h-5 w-5 text-green-500" />
    ) : (
      <XCircle className="h-5 w-5 text-red-500" />
    );
  };

  const getStatusBadge = (answer: boolean, required: boolean) => {
    if (answer) {
      return (
        <Badge
          variant="default"
          className="bg-green-100 text-green-800 border-green-200"
        >
          Yes
        </Badge>
      );
    } else if (required) {
      return (
        <Badge
          variant="destructive"
          className="bg-red-100 text-red-800 border-red-200"
        >
          No
        </Badge>
      );
    } else {
      return (
        <Badge
          variant="secondary"
          className="bg-gray-100 text-gray-800 border-gray-200"
        >
          No
        </Badge>
      );
    }
  };

  const getComplianceStatus = () => {
    const requiredQuestions = questions.filter((q) => q.required);
    const answeredRequired = requiredQuestions.filter((q) => q.answer).length;
    const totalRequired = requiredQuestions.length;

    if (answeredRequired === totalRequired) {
      return {
        status: 'compliant',
        message: 'All required compliance criteria met',
        icon: <CheckCircle className="h-5 w-5 text-green-500" />,
      };
    } else {
      return {
        status: 'non-compliant',
        message: `${totalRequired - answeredRequired} required criteria not met`,
        icon: <AlertCircle className="h-5 w-5 text-amber-500" />,
      };
    }
  };

  const compliance = getComplianceStatus();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-semibold">{title}</CardTitle>
              <CardDescription className="mt-1">{description}</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              {compliance.icon}
              <Badge
                variant={
                  compliance.status === 'compliant' ? 'default' : 'destructive'
                }
                className={
                  compliance.status === 'compliant'
                    ? 'bg-green-100 text-green-800 border-green-200'
                    : 'bg-amber-100 text-amber-800 border-amber-200'
                }
              >
                {compliance.status === 'compliant'
                  ? 'Compliant'
                  : 'Review Required'}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {questions.map((question) => (
                <div
                  key={question.id}
                  className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800/50"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-medium text-sm text-gray-900 dark:text-gray-100">
                          {question.question}
                        </h4>
                        {question.required && (
                          <span className="text-red-500 text-sm">*</span>
                        )}
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                        {question.description}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(question.answer)}
                      {getStatusBadge(question.answer, question.required)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Additional Information */}
            {(data.ethicalReference || data.founders) && (
              <div className="mt-6 pt-4 border-t">
                <h4 className="font-medium text-sm text-gray-900 dark:text-gray-100 mb-3">
                  Additional Details
                </h4>
                <div className="space-y-3">
                  {data.ethicalReference && (
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                        Ethical Reference:
                      </p>
                      <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                        {data.ethicalReference}
                      </p>
                    </div>
                  )}
                  {data.founders && (
                    <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <p className="text-sm font-medium text-purple-900 dark:text-purple-100">
                        Funding Source:
                      </p>
                      <p className="text-sm text-purple-700 dark:text-purple-300 mt-1">
                        {data.founders}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Compliance Summary */}
            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                {compliance.icon}
                <h4 className="font-medium text-sm text-gray-900 dark:text-gray-100">
                  Compliance Status
                </h4>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {compliance.message}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddsOnInformation;
