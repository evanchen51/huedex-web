import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type AnonymousVote = {
  __typename?: 'AnonymousVote';
  option: Option;
  optionId: Scalars['String'];
  poll: Poll;
  pollId: Scalars['String'];
};

export type CreatePollInput = {
  anonymous?: InputMaybe<Scalars['Boolean']>;
  existingTopics: Array<Scalars['String']>;
  media?: InputMaybe<MediaInput>;
  newTopics: Array<Scalars['String']>;
  options: Array<OptionInput>;
  text: Scalars['String'];
};

export type FeedItem = {
  __typename?: 'FeedItem';
  id: Scalars['String'];
  item?: Maybe<Poll>;
};

export type FollowTopic = {
  __typename?: 'FollowTopic';
  follower: User;
  followerId: Scalars['String'];
  topic: Topic;
  topicId: Scalars['String'];
};

export type Language = {
  __typename?: 'Language';
  code: Scalars['String'];
  englishName: Scalars['String'];
  nativeName: Scalars['String'];
};

export type MediaInput = {
  URL: Scalars['String'];
  type: Scalars['String'];
};

export type MediaType = {
  __typename?: 'MediaType';
  code: Scalars['String'];
  description: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addLanguage: Array<Language>;
  addMediaType: Array<MediaType>;
  createPoll?: Maybe<Poll>;
  deletePoll: Scalars['Boolean'];
  getS3URLs?: Maybe<Array<Scalars['String']>>;
  logout: Scalars['Boolean'];
  sendFollowLanguageReq: Scalars['Boolean'];
  sendFollowTopicReq: Scalars['Boolean'];
  sendFollowUserReq: Scalars['Boolean'];
  sendUnfollowLanguageReq: Scalars['Boolean'];
  sendUnfollowUserReq: Scalars['Boolean'];
  sendUnollowTopicReq: Scalars['Boolean'];
  sendVoteReq: Scalars['Boolean'];
  setUserDisplayLanguage: UserPersonalSettings;
  setUserDisplayName: User;
};


export type MutationAddLanguageArgs = {
  input: NewLanguage;
  passcode: Scalars['String'];
};


export type MutationAddMediaTypeArgs = {
  input: NewMediaType;
  passcode: Scalars['String'];
};


export type MutationCreatePollArgs = {
  createPollInput: CreatePollInput;
};


export type MutationDeletePollArgs = {
  id: Scalars['String'];
};


export type MutationGetS3UrLsArgs = {
  numOfReq: Scalars['Int'];
};


export type MutationSendFollowLanguageReqArgs = {
  languageCode: Scalars['String'];
};


export type MutationSendFollowTopicReqArgs = {
  topicId: Scalars['String'];
};


export type MutationSendFollowUserReqArgs = {
  userId: Scalars['String'];
};


export type MutationSendUnfollowLanguageReqArgs = {
  languageCode: Scalars['String'];
};


export type MutationSendUnfollowUserReqArgs = {
  userId: Scalars['String'];
};


export type MutationSendUnollowTopicReqArgs = {
  topicId: Scalars['String'];
};


export type MutationSendVoteReqArgs = {
  voteReq: VoteReq;
};


export type MutationSetUserDisplayLanguageArgs = {
  displayLanguageCode: Scalars['String'];
};


export type MutationSetUserDisplayNameArgs = {
  displayName: Scalars['String'];
};

export type NewLanguage = {
  code: Scalars['String'];
  englishName: Scalars['String'];
  nativeName: Scalars['String'];
};

export type NewMediaType = {
  code: Scalars['String'];
  description: Scalars['String'];
};

export type Option = {
  __typename?: 'Option';
  anonymousVotes?: Maybe<Array<AnonymousVote>>;
  createdAt: Scalars['String'];
  id: Scalars['String'];
  language?: Maybe<Language>;
  languageCode: Scalars['String'];
  mediaType?: Maybe<MediaType>;
  mediaTypeCode?: Maybe<Scalars['String']>;
  mediaURL?: Maybe<Scalars['String']>;
  numOfVotes: Scalars['Int'];
  poll?: Maybe<Poll>;
  pollId: Scalars['String'];
  text: Scalars['String'];
  updatedAt: Scalars['String'];
  votes?: Maybe<Array<Vote>>;
};

export type OptionInput = {
  media?: InputMaybe<MediaInput>;
  text: Scalars['String'];
};

export type Poll = {
  __typename?: 'Poll';
  anonymousVotes?: Maybe<Array<AnonymousVote>>;
  createdAt: Scalars['String'];
  featured?: Maybe<Scalars['Boolean']>;
  id: Scalars['String'];
  languageCode: Scalars['String'];
  mediaType?: Maybe<MediaType>;
  mediaTypeCode?: Maybe<Scalars['String']>;
  mediaURL?: Maybe<Scalars['String']>;
  numOfChoices: Scalars['Int'];
  numOfOptions?: Maybe<Scalars['Int']>;
  numOfVotes: Scalars['Int'];
  options?: Maybe<Array<Option>>;
  pollType?: Maybe<PollType>;
  pollTypeCode?: Maybe<Scalars['String']>;
  poster?: Maybe<User>;
  posterId?: Maybe<Scalars['String']>;
  sensitive: Scalars['Boolean'];
  text: Scalars['String'];
  topOptions?: Maybe<Array<Option>>;
  topics: Array<PollTopic>;
  updatedAt: Scalars['String'];
  votes?: Maybe<Array<Vote>>;
};

export type PollTopic = {
  __typename?: 'PollTopic';
  poll?: Maybe<Poll>;
  pollId: Scalars['String'];
  topic?: Maybe<Topic>;
  topicId: Scalars['String'];
};

export type PollType = {
  __typename?: 'PollType';
  code: Scalars['String'];
  info: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  checkAdmin: Scalars['Boolean'];
  createPollCheck: Scalars['Boolean'];
  getAllLanguages?: Maybe<Array<Language>>;
  getAllTopics: Array<Topic>;
  getCurrentUser?: Maybe<User>;
  getCurrentUserPersonalSettings?: Maybe<UserPersonalSettings>;
  getHomeFeed: Array<FeedItem>;
  getSimilarPolls: Array<FeedItem>;
  getSinglePoll?: Maybe<Poll>;
  getTopicNewPolls: Array<FeedItem>;
  getTopicTopPolls: Array<FeedItem>;
  getUser?: Maybe<User>;
  getUserPostedPolls: Array<FeedItem>;
  getUserVotedPolls: Array<FeedItem>;
  getVisitorFeed: Array<FeedItem>;
  getVoteHistory: Array<Vote>;
  test?: Maybe<Scalars['String']>;
};


export type QueryCheckAdminArgs = {
  passcode: Scalars['String'];
};


export type QueryGetHomeFeedArgs = {
  seen: Array<Scalars['String']>;
};


export type QueryGetSimilarPollsArgs = {
  text: Scalars['String'];
};


export type QueryGetSinglePollArgs = {
  id: Scalars['String'];
};


export type QueryGetTopicNewPollsArgs = {
  cursorId?: InputMaybe<Scalars['String']>;
  topicId: Scalars['String'];
};


export type QueryGetTopicTopPollsArgs = {
  cursorId?: InputMaybe<Scalars['String']>;
  topicId: Scalars['String'];
};


export type QueryGetUserArgs = {
  id: Scalars['String'];
};


export type QueryGetUserPostedPollsArgs = {
  cursorId?: InputMaybe<Scalars['String']>;
  userId: Scalars['String'];
};


export type QueryGetUserVotedPollsArgs = {
  cursorId?: InputMaybe<Scalars['String']>;
  userId: Scalars['String'];
};


export type QueryGetVisitorFeedArgs = {
  languageCodes: Array<Scalars['String']>;
};

export type Topic = {
  __typename?: 'Topic';
  followers?: Maybe<Array<FollowTopic>>;
  id: Scalars['String'];
  polls?: Maybe<Array<PollTopic>>;
};

export type User = {
  __typename?: 'User';
  createdAt?: Maybe<Scalars['String']>;
  displayName?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  personalSetting?: Maybe<UserPersonalSettings>;
  private: Scalars['Boolean'];
};

export type UserPersonalSettings = {
  __typename?: 'UserPersonalSettings';
  displayLanguageCode?: Maybe<Scalars['String']>;
  displaylanguage: Language;
  user: User;
  userId: Scalars['String'];
};

export type Vote = {
  __typename?: 'Vote';
  option: Option;
  optionId: Scalars['String'];
  poll: Poll;
  pollId: Scalars['String'];
  voter: User;
  voterId: Scalars['String'];
};

export type VoteReq = {
  numOfChoices: Scalars['Float'];
  pollId: Scalars['String'];
  voteState: Array<VoteState>;
};

export type VoteState = {
  optionId: Scalars['String'];
  state: Scalars['String'];
};

export type CreatePollMutationVariables = Exact<{
  createPollInput: CreatePollInput;
}>;


export type CreatePollMutation = { __typename?: 'Mutation', createPoll?: { __typename: 'Poll', id: string, text: string, numOfVotes: number, sensitive: boolean, posterId?: string | null | undefined, numOfChoices: number, languageCode: string, createdAt: string, updatedAt: string, poster?: { __typename: 'User', id: string, displayName?: string | null | undefined, private: boolean } | null | undefined, topOptions?: Array<{ __typename: 'Option', id: string, text: string, numOfVotes: number, pollId: string, languageCode: string, createdAt: string, updatedAt: string }> | null | undefined, topics: Array<{ __typename: 'PollTopic', pollId: string, topicId: string }> } | null | undefined };

export type DeletePollMutationVariables = Exact<{
  id: Scalars['String'];
}>;


export type DeletePollMutation = { __typename?: 'Mutation', deletePoll: boolean };

export type GetS3UrLsMutationVariables = Exact<{
  numOfReq: Scalars['Int'];
}>;


export type GetS3UrLsMutation = { __typename?: 'Mutation', getS3URLs?: Array<string> | null | undefined };

export type SendVoteReqMutationVariables = Exact<{
  voteReq: VoteReq;
}>;


export type SendVoteReqMutation = { __typename?: 'Mutation', sendVoteReq: boolean };

export type SetUserDisplayLanguageMutationVariables = Exact<{
  displayLanguageCode: Scalars['String'];
}>;


export type SetUserDisplayLanguageMutation = { __typename?: 'Mutation', setUserDisplayLanguage: { __typename?: 'UserPersonalSettings', userId: string, displayLanguageCode?: string | null | undefined } };

export type SetUserDisplayNameMutationVariables = Exact<{
  displayName: Scalars['String'];
}>;


export type SetUserDisplayNameMutation = { __typename?: 'Mutation', setUserDisplayName: { __typename?: 'User', id: string, displayName?: string | null | undefined } };

export type CreatePollCheckQueryVariables = Exact<{ [key: string]: never; }>;


export type CreatePollCheckQuery = { __typename?: 'Query', createPollCheck: boolean };

export type GetAllLanguagesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllLanguagesQuery = { __typename?: 'Query', getAllLanguages?: Array<{ __typename: 'Language', code: string, nativeName: string }> | null | undefined };

export type GetAllOptionsQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type GetAllOptionsQuery = { __typename?: 'Query', getSinglePoll?: { __typename: 'Poll', id: string, options?: Array<{ __typename: 'Option', id: string, text: string, numOfVotes: number, pollId: string, languageCode: string, mediaTypeCode?: string | null | undefined, mediaURL?: string | null | undefined, createdAt: string, updatedAt: string }> | null | undefined } | null | undefined };

export type GetAllTopicsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllTopicsQuery = { __typename?: 'Query', getAllTopics: Array<{ __typename: 'Topic', id: string }> };

export type GetCurrentUserQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCurrentUserQuery = { __typename?: 'Query', getCurrentUser?: { __typename: 'User', id: string, displayName?: string | null | undefined } | null | undefined };

export type GetCurrentUserPersonalSettingsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCurrentUserPersonalSettingsQuery = { __typename?: 'Query', getCurrentUserPersonalSettings?: { __typename: 'UserPersonalSettings', userId: string, displayLanguageCode?: string | null | undefined } | null | undefined };

export type GetHomeFeedQueryVariables = Exact<{
  seen: Array<Scalars['String']> | Scalars['String'];
}>;


export type GetHomeFeedQuery = { __typename?: 'Query', getHomeFeed: Array<{ __typename: 'FeedItem', id: string, item?: { __typename: 'Poll', id: string, text: string, numOfVotes: number, featured?: boolean | null | undefined, sensitive: boolean, posterId?: string | null | undefined, numOfChoices: number, languageCode: string, mediaTypeCode?: string | null | undefined, mediaURL?: string | null | undefined, createdAt: string, updatedAt: string, numOfOptions?: number | null | undefined, poster?: { __typename: 'User', id: string, displayName?: string | null | undefined, private: boolean } | null | undefined, topOptions?: Array<{ __typename: 'Option', id: string, text: string, numOfVotes: number, pollId: string, languageCode: string, mediaTypeCode?: string | null | undefined, mediaURL?: string | null | undefined, createdAt: string, updatedAt: string }> | null | undefined, topics: Array<{ __typename: 'PollTopic', pollId: string, topicId: string }> } | null | undefined }> };

export type GetSimilarPollsQueryVariables = Exact<{
  text: Scalars['String'];
}>;


export type GetSimilarPollsQuery = { __typename?: 'Query', getSimilarPolls: Array<{ __typename: 'FeedItem', id: string, item?: { __typename: 'Poll', id: string, text: string, numOfVotes: number, featured?: boolean | null | undefined, sensitive: boolean, posterId?: string | null | undefined, numOfChoices: number, languageCode: string, mediaTypeCode?: string | null | undefined, mediaURL?: string | null | undefined, createdAt: string, updatedAt: string, poster?: { __typename: 'User', id: string, displayName?: string | null | undefined, private: boolean } | null | undefined, topOptions?: Array<{ __typename: 'Option', id: string, text: string, numOfVotes: number, pollId: string, languageCode: string, mediaTypeCode?: string | null | undefined, mediaURL?: string | null | undefined, createdAt: string, updatedAt: string }> | null | undefined, topics: Array<{ __typename: 'PollTopic', pollId: string, topicId: string }> } | null | undefined }> };

export type GetSinglePollQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type GetSinglePollQuery = { __typename?: 'Query', getSinglePoll?: { __typename: 'Poll', id: string, text: string, numOfVotes: number, featured?: boolean | null | undefined, sensitive: boolean, posterId?: string | null | undefined, numOfChoices: number, languageCode: string, mediaTypeCode?: string | null | undefined, mediaURL?: string | null | undefined, createdAt: string, updatedAt: string, numOfOptions?: number | null | undefined, poster?: { __typename: 'User', id: string, displayName?: string | null | undefined, private: boolean } | null | undefined, topOptions?: Array<{ __typename: 'Option', id: string, text: string, numOfVotes: number, pollId: string, languageCode: string, mediaTypeCode?: string | null | undefined, mediaURL?: string | null | undefined, createdAt: string, updatedAt: string }> | null | undefined, topics: Array<{ __typename: 'PollTopic', pollId: string, topicId: string }> } | null | undefined };

export type GetTopicNewPollsQueryVariables = Exact<{
  topicId: Scalars['String'];
  cursorId?: InputMaybe<Scalars['String']>;
}>;


export type GetTopicNewPollsQuery = { __typename?: 'Query', getTopicNewPolls: Array<{ __typename: 'FeedItem', id: string, item?: { __typename: 'Poll', id: string, text: string, numOfVotes: number, featured?: boolean | null | undefined, sensitive: boolean, posterId?: string | null | undefined, numOfChoices: number, languageCode: string, mediaTypeCode?: string | null | undefined, mediaURL?: string | null | undefined, createdAt: string, updatedAt: string, numOfOptions?: number | null | undefined, poster?: { __typename: 'User', id: string, displayName?: string | null | undefined, private: boolean } | null | undefined, topOptions?: Array<{ __typename: 'Option', id: string, text: string, numOfVotes: number, pollId: string, languageCode: string, mediaTypeCode?: string | null | undefined, mediaURL?: string | null | undefined, createdAt: string, updatedAt: string }> | null | undefined, topics: Array<{ __typename: 'PollTopic', pollId: string, topicId: string }> } | null | undefined }> };

export type GetTopicTopPollsQueryVariables = Exact<{
  topicId: Scalars['String'];
  cursorId?: InputMaybe<Scalars['String']>;
}>;


export type GetTopicTopPollsQuery = { __typename?: 'Query', getTopicTopPolls: Array<{ __typename: 'FeedItem', id: string, item?: { __typename: 'Poll', id: string, text: string, numOfVotes: number, featured?: boolean | null | undefined, sensitive: boolean, posterId?: string | null | undefined, numOfChoices: number, languageCode: string, mediaTypeCode?: string | null | undefined, mediaURL?: string | null | undefined, createdAt: string, updatedAt: string, numOfOptions?: number | null | undefined, poster?: { __typename: 'User', id: string, displayName?: string | null | undefined, private: boolean } | null | undefined, topOptions?: Array<{ __typename: 'Option', id: string, text: string, numOfVotes: number, pollId: string, languageCode: string, mediaTypeCode?: string | null | undefined, mediaURL?: string | null | undefined, createdAt: string, updatedAt: string }> | null | undefined, topics: Array<{ __typename: 'PollTopic', pollId: string, topicId: string }> } | null | undefined }> };

export type GetUserQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type GetUserQuery = { __typename?: 'Query', getUser?: { __typename: 'User', id: string, displayName?: string | null | undefined } | null | undefined };

export type GetUserPostedPollsQueryVariables = Exact<{
  userId: Scalars['String'];
  cursorId?: InputMaybe<Scalars['String']>;
}>;


export type GetUserPostedPollsQuery = { __typename?: 'Query', getUserPostedPolls: Array<{ __typename: 'FeedItem', id: string, item?: { __typename: 'Poll', id: string, text: string, numOfVotes: number, featured?: boolean | null | undefined, sensitive: boolean, posterId?: string | null | undefined, numOfChoices: number, languageCode: string, mediaTypeCode?: string | null | undefined, mediaURL?: string | null | undefined, createdAt: string, updatedAt: string, numOfOptions?: number | null | undefined, poster?: { __typename: 'User', id: string, displayName?: string | null | undefined, private: boolean } | null | undefined, topOptions?: Array<{ __typename: 'Option', id: string, text: string, numOfVotes: number, pollId: string, languageCode: string, mediaTypeCode?: string | null | undefined, mediaURL?: string | null | undefined, createdAt: string, updatedAt: string }> | null | undefined, topics: Array<{ __typename: 'PollTopic', pollId: string, topicId: string }> } | null | undefined }> };

export type GetUserVotedPollsQueryVariables = Exact<{
  userId: Scalars['String'];
  cursorId?: InputMaybe<Scalars['String']>;
}>;


export type GetUserVotedPollsQuery = { __typename?: 'Query', getUserVotedPolls: Array<{ __typename: 'FeedItem', id: string, item?: { __typename: 'Poll', id: string, text: string, numOfVotes: number, featured?: boolean | null | undefined, sensitive: boolean, posterId?: string | null | undefined, numOfChoices: number, languageCode: string, mediaTypeCode?: string | null | undefined, mediaURL?: string | null | undefined, createdAt: string, updatedAt: string, numOfOptions?: number | null | undefined, poster?: { __typename: 'User', id: string, displayName?: string | null | undefined, private: boolean } | null | undefined, topOptions?: Array<{ __typename: 'Option', id: string, text: string, numOfVotes: number, pollId: string, languageCode: string, mediaTypeCode?: string | null | undefined, mediaURL?: string | null | undefined, createdAt: string, updatedAt: string }> | null | undefined, topics: Array<{ __typename: 'PollTopic', pollId: string, topicId: string }> } | null | undefined }> };

export type GetVisitorFeedQueryVariables = Exact<{
  languageCodes: Array<Scalars['String']> | Scalars['String'];
}>;


export type GetVisitorFeedQuery = { __typename?: 'Query', getVisitorFeed: Array<{ __typename: 'FeedItem', id: string, item?: { __typename: 'Poll', id: string, text: string, numOfVotes: number, featured?: boolean | null | undefined, sensitive: boolean, posterId?: string | null | undefined, numOfChoices: number, languageCode: string, mediaTypeCode?: string | null | undefined, mediaURL?: string | null | undefined, createdAt: string, updatedAt: string, numOfOptions?: number | null | undefined, poster?: { __typename: 'User', id: string, displayName?: string | null | undefined, private: boolean } | null | undefined, topOptions?: Array<{ __typename: 'Option', id: string, text: string, numOfVotes: number, pollId: string, languageCode: string, mediaTypeCode?: string | null | undefined, mediaURL?: string | null | undefined, createdAt: string, updatedAt: string }> | null | undefined, topics: Array<{ __typename: 'PollTopic', pollId: string, topicId: string }> } | null | undefined }> };

export type GetVoteHistoryQueryVariables = Exact<{ [key: string]: never; }>;


export type GetVoteHistoryQuery = { __typename?: 'Query', getVoteHistory: Array<{ __typename: 'Vote', optionId: string, pollId: string }> };


export const CreatePollDocument = gql`
    mutation CreatePoll($createPollInput: CreatePollInput!) {
  createPoll(createPollInput: $createPollInput) {
    __typename
    id
    text
    numOfVotes
    sensitive
    posterId
    numOfChoices
    languageCode
    createdAt
    updatedAt
    poster {
      __typename
      id
      displayName
      private
    }
    topOptions {
      __typename
      id
      text
      numOfVotes
      pollId
      languageCode
      createdAt
      updatedAt
    }
    topics {
      __typename
      pollId
      topicId
    }
  }
}
    `;

export function useCreatePollMutation() {
  return Urql.useMutation<CreatePollMutation, CreatePollMutationVariables>(CreatePollDocument);
};
export const DeletePollDocument = gql`
    mutation DeletePoll($id: String!) {
  deletePoll(id: $id)
}
    `;

export function useDeletePollMutation() {
  return Urql.useMutation<DeletePollMutation, DeletePollMutationVariables>(DeletePollDocument);
};
export const GetS3UrLsDocument = gql`
    mutation GetS3URLs($numOfReq: Int!) {
  getS3URLs(numOfReq: $numOfReq)
}
    `;

export function useGetS3UrLsMutation() {
  return Urql.useMutation<GetS3UrLsMutation, GetS3UrLsMutationVariables>(GetS3UrLsDocument);
};
export const SendVoteReqDocument = gql`
    mutation SendVoteReq($voteReq: VoteReq!) {
  sendVoteReq(voteReq: $voteReq)
}
    `;

export function useSendVoteReqMutation() {
  return Urql.useMutation<SendVoteReqMutation, SendVoteReqMutationVariables>(SendVoteReqDocument);
};
export const SetUserDisplayLanguageDocument = gql`
    mutation SetUserDisplayLanguage($displayLanguageCode: String!) {
  setUserDisplayLanguage(displayLanguageCode: $displayLanguageCode) {
    userId
    displayLanguageCode
  }
}
    `;

export function useSetUserDisplayLanguageMutation() {
  return Urql.useMutation<SetUserDisplayLanguageMutation, SetUserDisplayLanguageMutationVariables>(SetUserDisplayLanguageDocument);
};
export const SetUserDisplayNameDocument = gql`
    mutation SetUserDisplayName($displayName: String!) {
  setUserDisplayName(displayName: $displayName) {
    id
    displayName
  }
}
    `;

export function useSetUserDisplayNameMutation() {
  return Urql.useMutation<SetUserDisplayNameMutation, SetUserDisplayNameMutationVariables>(SetUserDisplayNameDocument);
};
export const CreatePollCheckDocument = gql`
    query CreatePollCheck {
  createPollCheck
}
    `;

export function useCreatePollCheckQuery(options: Omit<Urql.UseQueryArgs<CreatePollCheckQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<CreatePollCheckQuery>({ query: CreatePollCheckDocument, ...options });
};
export const GetAllLanguagesDocument = gql`
    query GetAllLanguages {
  getAllLanguages {
    __typename
    code
    nativeName
  }
}
    `;

export function useGetAllLanguagesQuery(options: Omit<Urql.UseQueryArgs<GetAllLanguagesQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetAllLanguagesQuery>({ query: GetAllLanguagesDocument, ...options });
};
export const GetAllOptionsDocument = gql`
    query GetAllOptions($id: String!) {
  getSinglePoll(id: $id) {
    __typename
    id
    options {
      __typename
      id
      text
      numOfVotes
      pollId
      languageCode
      mediaTypeCode
      mediaURL
      createdAt
      updatedAt
    }
  }
}
    `;

export function useGetAllOptionsQuery(options: Omit<Urql.UseQueryArgs<GetAllOptionsQueryVariables>, 'query'>) {
  return Urql.useQuery<GetAllOptionsQuery>({ query: GetAllOptionsDocument, ...options });
};
export const GetAllTopicsDocument = gql`
    query GetAllTopics {
  getAllTopics {
    __typename
    id
  }
}
    `;

export function useGetAllTopicsQuery(options: Omit<Urql.UseQueryArgs<GetAllTopicsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetAllTopicsQuery>({ query: GetAllTopicsDocument, ...options });
};
export const GetCurrentUserDocument = gql`
    query GetCurrentUser {
  getCurrentUser {
    __typename
    id
    displayName
  }
}
    `;

export function useGetCurrentUserQuery(options: Omit<Urql.UseQueryArgs<GetCurrentUserQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetCurrentUserQuery>({ query: GetCurrentUserDocument, ...options });
};
export const GetCurrentUserPersonalSettingsDocument = gql`
    query GetCurrentUserPersonalSettings {
  getCurrentUserPersonalSettings {
    __typename
    userId
    displayLanguageCode
  }
}
    `;

export function useGetCurrentUserPersonalSettingsQuery(options: Omit<Urql.UseQueryArgs<GetCurrentUserPersonalSettingsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetCurrentUserPersonalSettingsQuery>({ query: GetCurrentUserPersonalSettingsDocument, ...options });
};
export const GetHomeFeedDocument = gql`
    query GetHomeFeed($seen: [String!]!) {
  getHomeFeed(seen: $seen) {
    __typename
    id
    item {
      __typename
      id
      text
      numOfVotes
      featured
      sensitive
      posterId
      numOfChoices
      languageCode
      mediaTypeCode
      mediaURL
      createdAt
      updatedAt
      poster {
        __typename
        id
        displayName
        private
      }
      topOptions {
        __typename
        id
        text
        numOfVotes
        pollId
        languageCode
        mediaTypeCode
        mediaURL
        createdAt
        updatedAt
      }
      numOfOptions
      topics {
        __typename
        pollId
        topicId
      }
    }
  }
}
    `;

export function useGetHomeFeedQuery(options: Omit<Urql.UseQueryArgs<GetHomeFeedQueryVariables>, 'query'>) {
  return Urql.useQuery<GetHomeFeedQuery>({ query: GetHomeFeedDocument, ...options });
};
export const GetSimilarPollsDocument = gql`
    query GetSimilarPolls($text: String!) {
  getSimilarPolls(text: $text) {
    __typename
    id
    item {
      __typename
      id
      text
      numOfVotes
      featured
      sensitive
      posterId
      numOfChoices
      languageCode
      mediaTypeCode
      mediaURL
      createdAt
      updatedAt
      poster {
        __typename
        id
        displayName
        private
      }
      topOptions {
        __typename
        id
        text
        numOfVotes
        pollId
        languageCode
        mediaTypeCode
        mediaURL
        createdAt
        updatedAt
      }
      topics {
        __typename
        pollId
        topicId
      }
    }
  }
}
    `;

export function useGetSimilarPollsQuery(options: Omit<Urql.UseQueryArgs<GetSimilarPollsQueryVariables>, 'query'>) {
  return Urql.useQuery<GetSimilarPollsQuery>({ query: GetSimilarPollsDocument, ...options });
};
export const GetSinglePollDocument = gql`
    query GetSinglePoll($id: String!) {
  getSinglePoll(id: $id) {
    __typename
    id
    text
    numOfVotes
    featured
    sensitive
    posterId
    numOfChoices
    languageCode
    mediaTypeCode
    mediaURL
    createdAt
    updatedAt
    poster {
      __typename
      id
      displayName
      private
    }
    topOptions {
      __typename
      id
      text
      numOfVotes
      pollId
      languageCode
      mediaTypeCode
      mediaURL
      createdAt
      updatedAt
    }
    numOfOptions
    topics {
      __typename
      pollId
      topicId
    }
  }
}
    `;

export function useGetSinglePollQuery(options: Omit<Urql.UseQueryArgs<GetSinglePollQueryVariables>, 'query'>) {
  return Urql.useQuery<GetSinglePollQuery>({ query: GetSinglePollDocument, ...options });
};
export const GetTopicNewPollsDocument = gql`
    query GetTopicNewPolls($topicId: String!, $cursorId: String) {
  getTopicNewPolls(topicId: $topicId, cursorId: $cursorId) {
    __typename
    id
    item {
      __typename
      id
      text
      numOfVotes
      featured
      sensitive
      posterId
      numOfChoices
      languageCode
      mediaTypeCode
      mediaURL
      createdAt
      updatedAt
      poster {
        __typename
        id
        displayName
        private
      }
      topOptions {
        __typename
        id
        text
        numOfVotes
        pollId
        languageCode
        mediaTypeCode
        mediaURL
        createdAt
        updatedAt
      }
      numOfOptions
      topics {
        __typename
        pollId
        topicId
      }
    }
  }
}
    `;

export function useGetTopicNewPollsQuery(options: Omit<Urql.UseQueryArgs<GetTopicNewPollsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetTopicNewPollsQuery>({ query: GetTopicNewPollsDocument, ...options });
};
export const GetTopicTopPollsDocument = gql`
    query GetTopicTopPolls($topicId: String!, $cursorId: String) {
  getTopicTopPolls(topicId: $topicId, cursorId: $cursorId) {
    __typename
    id
    item {
      __typename
      id
      text
      numOfVotes
      featured
      sensitive
      posterId
      numOfChoices
      languageCode
      mediaTypeCode
      mediaURL
      createdAt
      updatedAt
      poster {
        __typename
        id
        displayName
        private
      }
      topOptions {
        __typename
        id
        text
        numOfVotes
        pollId
        languageCode
        mediaTypeCode
        mediaURL
        createdAt
        updatedAt
      }
      numOfOptions
      topics {
        __typename
        pollId
        topicId
      }
    }
  }
}
    `;

export function useGetTopicTopPollsQuery(options: Omit<Urql.UseQueryArgs<GetTopicTopPollsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetTopicTopPollsQuery>({ query: GetTopicTopPollsDocument, ...options });
};
export const GetUserDocument = gql`
    query GetUser($id: String!) {
  getUser(id: $id) {
    __typename
    id
    displayName
  }
}
    `;

export function useGetUserQuery(options: Omit<Urql.UseQueryArgs<GetUserQueryVariables>, 'query'>) {
  return Urql.useQuery<GetUserQuery>({ query: GetUserDocument, ...options });
};
export const GetUserPostedPollsDocument = gql`
    query GetUserPostedPolls($userId: String!, $cursorId: String) {
  getUserPostedPolls(userId: $userId, cursorId: $cursorId) {
    __typename
    id
    item {
      __typename
      id
      text
      numOfVotes
      featured
      sensitive
      posterId
      numOfChoices
      languageCode
      mediaTypeCode
      mediaURL
      createdAt
      updatedAt
      poster {
        __typename
        id
        displayName
        private
      }
      topOptions {
        __typename
        id
        text
        numOfVotes
        pollId
        languageCode
        mediaTypeCode
        mediaURL
        createdAt
        updatedAt
      }
      numOfOptions
      topics {
        __typename
        pollId
        topicId
      }
    }
  }
}
    `;

export function useGetUserPostedPollsQuery(options: Omit<Urql.UseQueryArgs<GetUserPostedPollsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetUserPostedPollsQuery>({ query: GetUserPostedPollsDocument, ...options });
};
export const GetUserVotedPollsDocument = gql`
    query GetUserVotedPolls($userId: String!, $cursorId: String) {
  getUserVotedPolls(userId: $userId, cursorId: $cursorId) {
    __typename
    id
    item {
      __typename
      id
      text
      numOfVotes
      featured
      sensitive
      posterId
      numOfChoices
      languageCode
      mediaTypeCode
      mediaURL
      createdAt
      updatedAt
      poster {
        __typename
        id
        displayName
        private
      }
      topOptions {
        __typename
        id
        text
        numOfVotes
        pollId
        languageCode
        mediaTypeCode
        mediaURL
        createdAt
        updatedAt
      }
      numOfOptions
      topics {
        __typename
        pollId
        topicId
      }
    }
  }
}
    `;

export function useGetUserVotedPollsQuery(options: Omit<Urql.UseQueryArgs<GetUserVotedPollsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetUserVotedPollsQuery>({ query: GetUserVotedPollsDocument, ...options });
};
export const GetVisitorFeedDocument = gql`
    query GetVisitorFeed($languageCodes: [String!]!) {
  getVisitorFeed(languageCodes: $languageCodes) {
    __typename
    id
    item {
      __typename
      id
      text
      numOfVotes
      featured
      sensitive
      posterId
      numOfChoices
      languageCode
      mediaTypeCode
      mediaURL
      createdAt
      updatedAt
      poster {
        __typename
        id
        displayName
        private
      }
      topOptions {
        __typename
        id
        text
        numOfVotes
        pollId
        languageCode
        mediaTypeCode
        mediaURL
        createdAt
        updatedAt
      }
      numOfOptions
      topics {
        __typename
        pollId
        topicId
      }
    }
  }
}
    `;

export function useGetVisitorFeedQuery(options: Omit<Urql.UseQueryArgs<GetVisitorFeedQueryVariables>, 'query'>) {
  return Urql.useQuery<GetVisitorFeedQuery>({ query: GetVisitorFeedDocument, ...options });
};
export const GetVoteHistoryDocument = gql`
    query GetVoteHistory {
  getVoteHistory {
    __typename
    optionId
    pollId
  }
}
    `;

export function useGetVoteHistoryQuery(options: Omit<Urql.UseQueryArgs<GetVoteHistoryQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetVoteHistoryQuery>({ query: GetVoteHistoryDocument, ...options });
};