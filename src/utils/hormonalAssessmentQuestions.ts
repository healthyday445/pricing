// Questions for /forms/hormonal-care-plan-assessment.
// Source: Google Form "Women's Harmonal Health Care Plan - Initial Health Assessment".
// Question ids are the keys sent to / received from the API.

const YES_SPECIFY = 'Yes – please specify below';
const FREQUENCY = ['Rarely', '1–2 times/week', '3–5 times/week', 'Daily'];

export type QuestionType = 'short' | 'number' | 'paragraph' | 'date' | 'phone' | 'radio' | 'checkbox' | 'file';

export interface Question {
    id: string;
    label: string;
    type: QuestionType;
    description?: string;
    required?: boolean;
    options?: string[];
    /** Adds an "Other" option with a free-text box (answer stored under `${id}_other`). */
    allowOther?: boolean;
    /** Checkbox option that clears every other selection, e.g. "None". */
    exclusiveOption?: string;
    /** Only shown when the answer to `questionId` is one of `values`. */
    showIf?: { questionId: string; values: string[] };
    /** File upload is not supported yet; rendered disabled. */
    disabled?: boolean;
    /** Shown inside the input, e.g. "cm". */
    unit?: string;
}

export interface Section {
    id: string;
    title: string;
    subtitle: string;
    questions: Question[];
}

const details = (id: string, parentId: string, label = 'Yes అయితే, వివరించండి'): Question => ({
    id,
    label,
    type: 'short',
    showIf: { questionId: parentId, values: [YES_SPECIFY] },
});

export const FORM_TITLE = 'PCOS & Weight Management';
export const FORM_SUBTITLE = 'Healthyday Initial Health Assessment';
export const FORM_DESCRIPTION =
    'దయచేసి అన్ని sections ను పూర్తిగా fill చేయండి. మీరు ఇచ్చే information confidential గా ఉంచబడుతుంది మరియు మీకు personalized health plan prepare చేయడానికి use అవుతుంది.';

export const SECTIONS: Section[] = [
    {
        id: 'user_details',
        title: 'User Details',
        subtitle: "Let's start with your name and registered mobile number.",
        questions: [
            { id: 'full_name', label: 'Full Name / పూర్తి పేరు', type: 'short', required: true },
            { id: 'mobile', label: 'Registered Mobile Number', type: 'phone', required: true },
        ],
    },
    {
        id: 'personal_details',
        title: 'Personal Details',
        subtitle: 'Basic details for your care plan and home blood sample collection.',
        questions: [
            { id: 'date_of_birth', label: 'Date of Birth', type: 'date', required: true },
            { id: 'age', label: 'Age (years)', type: 'number', required: true, unit: 'years' },
            {
                id: 'address',
                label: 'మీ పూర్తి Address',
                description: 'మీ ఇంటి వద్ద blood sample collection కోసం పూర్తి address ఇవ్వండి.',
                type: 'paragraph',
                required: true,
            },
            { id: 'city', label: 'City', type: 'short', required: true },
            { id: 'district', label: 'District', type: 'short', required: true },
            { id: 'pincode', label: 'Area Pincode', type: 'number', required: true },
            { id: 'occupation', label: 'Occupation', type: 'short', required: true },
            {
                id: 'marital_status',
                label: 'Marital Status',
                type: 'radio',
                required: true,
                options: ['Single', 'Married', 'Divorced', 'Widowed', 'Prefer not to say'],
            },
            {
                id: 'planning_pregnancy',
                label: 'ప్రస్తుతం మీరు pregnancy plan చేస్తున్నారా?',
                type: 'radio',
                options: ['Yes', 'No', 'Not sure'],
            },
        ],
    },
    {
        id: 'body_measurements',
        title: 'Basic Health Parameters – Body Measurements',
        subtitle: 'These measurements help us track your progress accurately.',
        questions: [
            { id: 'height_cm', label: 'Height (cmలో)', type: 'number', required: true, unit: 'cm' },
            { id: 'current_weight_kg', label: 'Current Weight (kgలో)', type: 'number', required: true, unit: 'kg' },
            { id: 'waist_cm', label: 'Waist Circumference (cmలో)', type: 'number', required: true, unit: 'cm' },
            { id: 'hip_cm', label: 'Hip Circumference (cmలో)', type: 'number', required: true, unit: 'cm' },
            { id: 'weight_6_months_ago_kg', label: 'Weight 6 months ago (kgలో)', type: 'number', unit: 'kg' },
            { id: 'highest_adult_weight_kg', label: 'Highest adult weight (kgలో)', type: 'number', unit: 'kg' },
            { id: 'lowest_adult_weight_kg', label: 'Lowest adult weight (kgలో)', type: 'number', unit: 'kg' },
        ],
    },
    {
        id: 'weight_pattern',
        title: 'Weight Pattern',
        subtitle: 'Tell us how your weight has changed over time.',
        questions: [
            {
                id: 'weight_gain_onset',
                label: 'మీకు బరువు ఎప్పటి నుండి ఎక్కువగా పెరగడం మొదలైంది?',
                type: 'radio',
                allowOther: true,
                options: [
                    'Puberty కి ముందు',
                    'Teenage years',
                    'Marriage తర్వాత',
                    'Pregnancy తర్వాత',
                    'Around menopause / perimenopause',
                    'In the last 1–2 years',
                ],
            },
            {
                id: 'weight_gain_area',
                label: 'మీకు ఎక్కువగా ఏ ప్రాంతంలో weight gain కనిపిస్తుంది?',
                type: 'radio',
                allowOther: true,
                options: ['పొట్ట / నడుము', 'తొడలు', 'Overall'],
            },
        ],
    },
    {
        id: 'hormonal_history',
        title: 'PCOS / Hormonal & Menstrual History',
        subtitle: 'Your cycle, symptoms and any diagnoses so far.',
        questions: [
            {
                id: 'pcos_diagnosed',
                label: 'మీకు ఎప్పుడైనా PCOD / PCOS ఉందని diagnosis అయ్యిందా?',
                type: 'radio',
                required: true,
                options: ['Yes', 'No', 'Suspected'],
            },
            {
                id: 'pcos_diagnosis_age',
                unit: 'years',
                label: 'మీకు ఏ ageలో PCOS ఉందని diagnosis అయ్యింది లేదా ఉండొచ్చని మొదట చెప్పారు?',
                type: 'number',
                showIf: { questionId: 'pcos_diagnosed', values: ['Yes', 'Suspected'] },
            },
            {
                id: 'periods_status',
                label: 'ప్రస్తుతం మీ periods ఎలా ఉన్నాయి?',
                type: 'radio',
                required: true,
                options: ['Regular', 'Irregular', 'Very irregular', 'No periods currently'],
            },
            {
                id: 'cycle_gap_days',
                unit: 'days',
                label: 'సాధారణంగా మీ periods మధ్య ఎన్ని days gap ఉంటుంది?',
                type: 'short',
                required: true,
            },
            {
                id: 'period_duration_days',
                unit: 'days',
                label: 'సాధారణంగా మీ period ఎన్ని days ఉంటుంది?',
                type: 'short',
                required: true,
            },
            {
                id: 'symptoms',
                label: 'క్రిందివాటిలో మీకు ఏవైనా symptoms ఉన్నాయా?',
                description: '(వర్తించేవన్నీ select చేయండి)',
                type: 'checkbox',
                exclusiveOption: 'పైవి ఏవీ లేవు',
                options: [
                    'Face / body మీద ఎక్కువ వెంట్రుకలు',
                    'జుట్టు పలచపడటం',
                    'Acne (మొటిమలు)',
                    'Neck / underarms దగ్గర చర్మం dark అవ్వడం',
                    'Weight తగ్గించడం కష్టంగా ఉండడం',
                    'పొట్ట మీద fat ఎక్కువ అవ్వడం',
                    'Mood changes ఉండడం',
                    'పైవి ఏవీ లేవు',
                ],
            },
            {
                id: 'fertility_difficulty',
                label: 'మీకు ఎప్పుడైనా pregnancy రావడంలో difficulty ఎదురైందా లేదా fertility treatment తీసుకున్నారా?',
                type: 'radio',
                options: ['No', 'Yes', 'Currently undergoing treatment'],
            },
            {
                id: 'pregnancy_complications',
                label: 'Pregnancy, miscarriage లేదా delivery సమయంలో మీకు ఏవైనా complications ఎదురయ్యాయా?',
                type: 'radio',
                options: ['No', YES_SPECIFY],
            },
            details(
                'pregnancy_complications_details',
                'pregnancy_complications',
                'Yes అయితే, ఎదురైన complications గురించి వివరించండి.'
            ),
            {
                id: 'other_hormonal_conditions',
                label: 'PCOS కాకుండా మీకు మరేదైనా hormonal / reproductive condition ఉందని diagnosis అయ్యిందా?',
                description: '(వర్తించేవన్నీ select చేయండి)',
                type: 'checkbox',
                allowOther: true,
                exclusiveOption: 'None',
                options: ['Endometriosis', 'Fibroids', 'Premature ovarian insufficiency', 'Thyroid disorder', 'None'],
            },
            {
                id: 'prescriptions_upload',
                label: 'ప్రస్తుతం మీరు తీసుకుంటున్న అన్ని medicines / treatmentsకు సంబంధించిన prescriptions upload చేయండి.',
                type: 'file',
                disabled: true,
            },
        ],
    },
    {
        id: 'health_lifestyle',
        title: 'Targeted Health, Family History & Lifestyle',
        subtitle: 'Medical history, sleep, stress and family history.',
        questions: [
            {
                id: 'metabolic_condition',
                label: 'మీకు ఎప్పుడైనా diabetes, pre-diabetes, hypertension, fatty liver, high cholesterol, thyroid disease, sleep apnoea లేదా మరేదైనా metabolic condition ఉందని diagnosis అయ్యిందా?',
                type: 'radio',
                options: ['No', YES_SPECIFY],
            },
            details('metabolic_condition_details', 'metabolic_condition'),
            {
                id: 'reproductive_problems',
                label: 'PCOS కాకుండా మీకు ఎప్పుడైనా significant menstrual లేదా reproductive problems ఉన్నాయా ?',
                description:
                    '(ఉదాహరణకు చాలా ఎక్కువ bleeding, ఎక్కువ కాలం periods రాకపోవడం, infertility, repeated miscarriages లేదా ovarian problems)',
                type: 'radio',
                options: ['No', YES_SPECIFY],
            },
            details('reproductive_problems_details', 'reproductive_problems'),
            {
                id: 'major_illness',
                label: 'మీకు ఎప్పుడైనా major surgery, hospitalisation లేదా serious medical illness జరిగిందా?',
                type: 'radio',
                options: ['No', YES_SPECIFY],
            },
            details('major_illness_details', 'major_illness'),
            {
                id: 'exercise_limitation',
                label: 'ప్రస్తుతం exercise చేయడం కష్టంగా లేదా unsafe గా అనిపించే ఏదైనా health condition, injury, pain లేదా physical limitation ఉందా?',
                type: 'radio',
                options: ['No', YES_SPECIFY],
            },
            details('exercise_limitation_details', 'exercise_limitation'),
            {
                id: 'fatigue_sleep_issues',
                label: 'మీకు ఎక్కువగా fatigue ఉండటం, పగటిపూట చాలా నిద్రగా అనిపించడం, loud snoring లేదా నిద్ర లేచిన తర్వాత కూడా freshగా అనిపించకపోవడం వంటి సమస్యలు ఉన్నాయా?',
                type: 'radio',
                options: ['No', 'Yes'],
            },
            {
                id: 'stress_level',
                label: 'ప్రస్తుతం మీ stress levels ఎలా ఉన్నాయి?',
                type: 'radio',
                options: ['Low', 'Moderate', 'High', 'Very high'],
            },
            {
                id: 'sleep_hours',
                label: 'సాధారణంగా మీరు రాత్రికి ఎన్ని గంటలు నిద్రపోతారు?',
                type: 'radio',
                options: ['Less than 5 hours', '5–6 hours', '6–7 hours', '7–8 hours', 'More than 8 hours'],
            },
            {
                id: 'family_metabolic_history',
                label: 'మీ immediate familyలో (parents లేదా siblings) ఎవరికైనా diabetes, obesity, hypertension, heart disease, PCOS, thyroid disease లేదా మరేదైనా significant hormonal / metabolic condition ఉందా లేదా గతంలో ఉందా?',
                type: 'radio',
                options: ['No', YES_SPECIFY],
            },
            details(
                'family_metabolic_history_details',
                'family_metabolic_history',
                'Yes అయితే, వారి relationship మరియు condition వివరించండి.'
            ),
            {
                id: 'family_reproductive_history',
                label: 'మీ familyలో fertility కి సంబంధించిన problems, early menopause లేదా ఇతర significant reproductive / hormonal problems ఉన్న history ఉందా?',
                type: 'radio',
                options: ['No', 'Yes', 'Not sure'],
            },
            {
                id: 'notes_for_doctor',
                label: 'మీ health, symptoms, reproductive history, weight journey లేదా గతంలో తీసుకున్న treatment గురించి మీ plan prepare చేయడానికి ముందు doctor తెలుసుకోవాల్సిన మరేదైనా information ఉందా?',
                type: 'paragraph',
            },
        ],
    },
    {
        id: 'eating_pattern',
        title: 'Eating Pattern',
        subtitle: 'Your everyday eating habits and preferences.',
        questions: [
            {
                id: 'meals_per_day',
                label: 'సాధారణంగా మీరు రోజుకు ఎన్ని meals తీసుకుంటారు?',
                type: 'radio',
                options: ['1–2', '3', '4', '5 or more'],
            },
            {
                id: 'skip_meals',
                label: 'మీరు తరచుగా meals skip చేస్తారా?',
                type: 'radio',
                options: ['Never', 'Occasionally', 'Frequently'],
            },
            {
                id: 'eating_out',
                label: 'మీరు ఎంత తరచుగా బయట food తింటారు లేదా food order చేస్తారు?',
                type: 'radio',
                options: ['Rarely', '1–2 times/week', '3–5 times/week', 'Almost daily'],
            },
            {
                id: 'sweets_frequency',
                label: 'మీరు ఎంత తరచుగా sweets, desserts లేదా sugary drinks తీసుకుంటారు?',
                type: 'radio',
                options: FREQUENCY,
            },
            {
                id: 'refined_carbs_frequency',
                label: 'మీరు ఎంత తరచుగా refined carbohydrates తీసుకుంటారు?',
                description: '(ఉదా: maidaతో చేసిన foods, white bread, bakery items, noodles మొదలైనవి.)',
                type: 'radio',
                options: FREQUENCY,
            },
            {
                id: 'fried_foods_frequency',
                label: 'మీరు ఎంత తరచుగా fried foods లేదా ultra-processed foods తీసుకుంటారు?',
                type: 'radio',
                options: FREQUENCY,
            },
            {
                id: 'dietary_preference',
                label: 'మీ Dietary preference ఏంటి?',
                type: 'radio',
                options: ['Vegetarian', 'Eggetarian', 'Non-vegetarian', 'Vegan'],
            },
            {
                id: 'food_restrictions',
                label: 'మీకు ఏవైనా food allergies, intolerances, బాగా నచ్చని foods లేదా dietary restrictions ఉన్నాయా?',
                type: 'paragraph',
            },
        ],
    },
];
