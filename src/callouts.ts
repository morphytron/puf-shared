import {
    AvailablePositions,
    EntryResponse,
    JavaMessage,
    JavaMessageWrapper,
    MapDetails,
    MetaList,
    NoResultsResponse,
    OAuthResponse,
    OAuthResponsePart1,
    Pageable,
    Provider,
    QmQServerEvent,
    ServerResponse,
    ServerStatistics,
    SessionResponse,
    SubscriptionWrapper,
    UserAndAccount,
} from '../definitions/responses';
import {HttpCall, INetwork, ReloginInfo, Service} from './network';
import {
    CrudType,
    DeleteEventsBatchOptions,
    FilterableAtlasRequest,
    FilterLocationRequest,
    ForumLookup,
    LocationRequest,
    QmQEntryRequest,
    QueryType,
    S3ResourceType,
    SessionRequest,
    Verification,
} from '../definitions/requests';
import {PaymentMethod, ProductAndPrices} from '../definitions/stripe';
import {
    BillToReview,
    CityTrack,
    Facility,
    FacilityMLReview,
    Invite,
    PlayableLocation,
    PlayableLocationML,
    PlayerStats,
    PublicUser,
    PufEvent,
    SocialMessage,
    Sport,
    SportInterest,
    SportPosition,
    SportRules,
    SuggestedEvent,
    TeamAndPubEventTeamMember,
    User,
    UserBadge,
    UserEvent,
    UserSportParticipationStats,
    Vote,
    VoteSessionVotesEventMembers,
} from '../definitions/schema';
import {Notification} from './notifications';
import {Query, QueryInfo} from './querying';
import {MetaDevice} from '../definitions/generic';
import getEnvironment from "../environment/environment";

export class NetworkMethods {

    /// QMQ calls
    public static getPositionsAvailable(relogin: ReloginInfo, network: INetwork, token: string,
                                        eventid: number,
                                        rulesid: number,
                                        showTeamId?: number,
    ): Promise<ServerResponse<AvailablePositions>> {
        return network.start(
            relogin,
            token,
            new HttpCall()
                .set_postfix_uri('qmq/quickmatch/v1/entry/availability')
                .set_no_messages(true)
                .set_service(Service.QmQ),
            JSON.stringify({
                rulesid: rulesid,
                eventid: eventid,
                showTeamId: showTeamId ? showTeamId : null,
            }),
            'post',
        );
    }

    public static promisifyIsInQm(
        relogin: ReloginInfo,
        network: INetwork,
        token: string,
        uid: number,
    ): Promise<ServerResponse<JavaMessage>> {
        return network.start(
            relogin,
            token,
            new HttpCall()
                .set_no_messages(true)
                .set_postfix_uri(
                    `qmq/quickmatch/v1/entry/isInQm/${uid}`,
                )
                .set_service(Service.QmQ),
            null,
            'get',
        );
    }

    public static promisifyServerEvents(
        relogin: ReloginInfo, network: INetwork, token: string, deviceLat: number, deviceLng: number, radius: number): Promise<ServerResponse<JavaMessage<QmQServerEvent[]>>> {
        return network.start(
            relogin,
            token,
            new HttpCall()
                .set_postfix_uri(
                    `qmq/statistics/v1/serverEvents`,
                )
                .set_service(Service.QmQ),
            JSON.stringify({
                count: 100,
                lat: deviceLat,
                lng: deviceLng,
                radius: radius,
            }),
            'post',
        );
    }

    public static promisifyServerStatistics(relogin: ReloginInfo, network: INetwork, token: string): Promise<ServerResponse<ServerStatistics>> {
        return network.start(
            relogin,
            token,
            new HttpCall()
                .set_postfix_uri(
                    `qmq/statistics/v1/serverStatistics`,
                )
                .set_service(Service.QmQ),
            undefined, 'get',
        );
    }

    public static promisifyCheckin(relogin: ReloginInfo,
                                   network: INetwork, token: string, lat: number, lng: number, uid: number,
    ): Promise<ServerResponse<JavaMessage>> {
        return network.start(
            relogin,
            token,
            new HttpCall()
                .set_no_messages(false)
                .set_success_msg('You have successfully checked in!')
                .set_postfix_uri(
                    `qmq/eventUserMember/v1/checkin/${uid}`,
                )
                .set_service(Service.QmQ),
            JSON.stringify({
                lat: lat,
                lng: lng,
            }),
            'post',
        );
    }

    public static promisifyLeaveEvent(relogin: ReloginInfo, network: INetwork, token: string,
                                      deleteOpts: DeleteEventsBatchOptions,
    ): Promise<ServerResponse<JavaMessage>> {
        return network.start(
            relogin,
            token,
            new HttpCall()
                .set_no_messages(true)
                .set_postfix_uri(
                    `qmq/quickmatch/v1/entry`
                )
                .set_service(Service.QmQ),
            JSON.stringify(deleteOpts),
            'delete',
        );
    }

    public static promisifyJoinQmQ(relogin: ReloginInfo, network: INetwork, token: string, qmqRequest: QmQEntryRequest): Promise<ServerResponse<EntryResponse | JavaMessageWrapper>> {
        const httpCall = new HttpCall()
            .set_success_msg('Joined quick match!')
            .set_no_messages(false)
            .set_postfix_uri('qmq/quickmatch/v1/entry')
            .set_service(Service.QmQ);
        return network.start(
            relogin, token, httpCall, JSON.stringify(qmqRequest), 'post');
    }

    public static promisifyGetEntryResponseByUidAndEventid(relogin: ReloginInfo, network: INetwork, token: string, uid: number,
                                                           eventid: number,
    ): Promise<ServerResponse<EntryResponse | JavaMessageWrapper>> {
        const httpCall = new HttpCall()
            .set_success_msg('Retrieved event details.')
            .set_no_messages(false)
            .set_postfix_uri(`qmq/quickmatch/v1/entry/${uid}/${eventid}`)
            .set_service(Service.QmQ);
        return network.start(
            relogin, token, httpCall, undefined, 'get', false, undefined);
    }

    // Notifier calls
    public static promisifyNewsletter(relogin: ReloginInfo, network: INetwork, token: string, email, router, dispatch): Promise<ServerResponse<NoResultsResponse>> {
        const notif: Notification = new Notification('newsletter');
        notif.emailAddresses = [email];
        return network.start(
            relogin,
            token,
            new HttpCall()
                .set_success_msg('Newsletter subscribed to.  Please verify your email address.')
                .set_no_messages(false)
                .set_service(Service.Notifications)
                .set_postfix_uri(`notifier/notifyNonUser`),
            JSON.stringify(notif),
            'POST',
        );
    }

    public static promisifyNotification(relogin: ReloginInfo, network: INetwork, token: string, notification: Notification): Promise<ServerResponse<NoResultsResponse>> {
        return network.start(
            relogin,
            token,
            new HttpCall()
                .set_success_msg('Notification sent')
                .set_no_messages(false)
                .set_service(Service.Notifications)
                .set_postfix_uri(`notifier/notify`),
            JSON.stringify(notification),
            'POST',
        );
    }

    // Billing calls
    public static promisifyGetAllSubscriptions(relogin: ReloginInfo, network: INetwork): Promise<ServerResponse<Array<ProductAndPrices>>> {
        return network.start(
            relogin,
            null,
            new HttpCall()
                .set_no_messages(false)
                .set_service(Service.Billing)
                .set_postfix_uri(`billing/subscriptions/v1/allSubscriptions`),
            undefined,
            'GET',
        );
    }

    public static promisifyCreateSession(relogin: ReloginInfo, network: INetwork, token: string, session: SessionRequest): Promise<ServerResponse<SessionResponse>> {
        return network.start(
            relogin,
            token,
            new HttpCall()
                .set_no_messages(false)
                .set_service(Service.Billing)
                .set_postfix_uri(`billing/v1/session/createSession`),
            JSON.stringify(session),
            'POST',
        );
    }

    public static promisifyRemovePaymentMethod(relogin: ReloginInfo, network: INetwork, token: string, customerId: string, paymentMethodId: string, type: string): Promise<ServerResponse<any>> {
        return network.start(
            relogin, token, new HttpCall().set_no_messages(true).set_service(Service.Billing).set_postfix_uri(`billing/payments/v1/remove/${customerId}`),
            JSON.stringify({
                payment_method_id: paymentMethodId,
                delete: true,
                type: type,
            }), 'POST');
    }

    public static promisifyAddPaymentMethod(relogin: ReloginInfo, network: INetwork, token: string, customerId: string, card: any): Promise<ServerResponse<Array<PaymentMethod>>> {
        return network.start(
            relogin, token, new HttpCall().set_no_messages(true).set_service(Service.Billing).set_postfix_uri(`billing/payments/v1/add/${customerId}`),
            JSON.stringify(card), 'POST');
    }

    public static promisifyAllPaymentMethods(relogin: ReloginInfo, network: INetwork, token: string, customerId: string): Promise<ServerResponse<Array<PaymentMethod>>> {
        return network.start(
            relogin, token, new HttpCall().set_no_messages(true).set_service(Service.Billing).set_postfix_uri(`billing/payments/v1/listAll/${customerId}`),
            undefined, 'GET');
    }

    public static promisifyGetUserSubscriptionsAndAllPUFSubscriptions(relogin: ReloginInfo, network: INetwork, token: string, customerId: string): Promise<ServerResponse<SubscriptionWrapper>> {
        return network.start(
            relogin,
            token,
            new HttpCall().set_no_messages(true).set_service(Service.Billing).set_postfix_uri(`billing/subscriptions/v1/allSubscribedAndAvailableSubscriptions/${customerId}`),
            undefined,
            'GET',
        );
    }

    public static promisifyGetUserSubscriptions(relogin: ReloginInfo, network: INetwork, token: string, uid: number): Promise<ServerResponse<any[]>> {
        return network.start(
            relogin,
            token,
            new HttpCall().set_no_messages(true).set_service(Service.Billing).set_postfix_uri(`billing/subscriptions/v1/allSubscriptionsByUserId/${uid}`),
            undefined,
            'GET',
        );
    }

    public static promisifyLoginUser(relogin: ReloginInfo, network: INetwork, token: string, un: string, pw: string): Promise<ServerResponse<UserAndAccount>> {
        return network.start(
            relogin,
            token,
            new HttpCall()
                .set_is_for_login(true)
                .set_success_msg('Logged in ' + un + '')
                .set_no_messages(false)
                .set_service(Service.Billing)
                .set_postfix_uri(`billing/v1/users/one/${un}/${pw}`),
            undefined,
            'GET',
        ).then(r => {
            //alert(JSON.stringify(r));
            if (r.isSuccessful) {
                console.log('Successfully logged in.');
            }
            return r;
        });
    }

    // API calls
    public static promisifyPutS3ImageObj(relogin: ReloginInfo, token: string,
                                         type_: S3ResourceType, pk: number,
                                         bytes: Uint8Array<ArrayBuffer>, mime: string): Promise<ServerResponse<NoResultsResponse>> {
        const env = getEnvironment();
        let status = -1;
        const headers = new Headers();
        headers.append('Content-Type', mime);
        headers.append('uid', String(relogin.user.id));
        headers.append('status', relogin.user.status);
        headers.append('puf-api-key',env.key_puf_api);
        headers.append('puf-api-gateway-key', env.gateway_api_key);
        headers.append('authorization', token);

        /**
         *  {
         *                 uid: '' + relogin.user.id,
         *                 status: relogin.user.status,
         *                 'Content-Type': mime,
         *                 Authorization: token,
         *                 'puf-api-gateway-key': env.gateway_api_key,
         *                 "puf-api-key": env.key_puf_api,
         *             }
         */
        return fetch(env.uri_puf_mobile_server + `api/resource/s3/type/${type_.toString()}/id/${pk}`, {
            headers: headers,
            method: 'PUT',
            body: bytes
        }).then(res => {
            status = res.status;
            return res.json();
        }).then(json => {
            return {isSuccessful: status >= 200 && status < 300, resp: json};
        });
    }

    /**
     * Query this to find playable locations ml by custom query without location.
     * @param relogin
     * @param network
     * @param token
     * @param query
     */
    public static promisifyPageablePlayableLocationML(relogin: ReloginInfo, network: INetwork, token: string, query: QueryType): Promise<ServerResponse<Pageable<PlayableLocationML>>> {
        return network.start(relogin,
            token,
            new HttpCall()
                .set_service(Service.Api)
                .set_postfix_uri('api/playable_locations_ml/search/paged')
                .set_success_msg('Found :count playable locations.')
            , JSON.stringify(query),
            'post',
        );
    }

    /**
     * Query this to find playable locations ml by location + custom query
     * (optional).
     * @param relogin
     * @param network
     * @param token
     * @param query
     */
    public static promisifyPageablePlayableLocationMLByLocation(relogin: ReloginInfo, network: INetwork, token: string, query: FilterLocationRequest): Promise<ServerResponse<Pageable<PlayableLocationML>>> {
        return network.start(relogin,
            token,
            new HttpCall()
                .set_service(Service.Api)
                .set_postfix_uri('api/playable_locations_ml/search/location/paged')
                .set_success_msg('Found :count playable locations.')
            , JSON.stringify(query),
            'post',
        );
    }

    /**
     * List the cities to review.
     * @param relogin
     * @param network
     * @param token
     * @param query
     */
    public static promisifyPageableCitiesTrack(relogin: ReloginInfo, network: INetwork, token: string, query: QueryType): Promise<ServerResponse<Pageable<CityTrack>>> {
        return network.start(relogin,
            token,
            new HttpCall()
                .set_service(Service.Api)
                .set_postfix_uri('api/cities_track/search/paged')
                .set_success_msg('Found :count city tracks.')
            , JSON.stringify(query),
            'post',
        );
    }

    /**
     * Call this to get all the ml facility reviews by playable_location_ml entry.
     * @param relogin
     * @param network
     * @param token
     * @param plml_id_ref
     */
    public static promisifyFacilityMlReviewByPLMLRef(relogin: ReloginInfo, network: INetwork, token: string, plml_id_ref: number): Promise<ServerResponse<Pageable<FacilityMLReview>>> {
        return network.start(relogin,
            token,
            new HttpCall()
                .set_service(Service.Api)
                .set_postfix_uri('api/facility_satellite_reviews/all/by/playable_location_ml_ref/' + plml_id_ref)
                .set_success_msg('Found :count facility-satellite review(s).')
            , undefined,
            'get',
        );
    }


    public static promisifyAllSportRulesBySportId(relogin: ReloginInfo, network: INetwork, token: string, sportid_: number): Promise<ServerResponse<SportRules[]>> {
        return network.start(relogin,
            token,
            new HttpCall()
                .set_service(Service.Api)
                .set_postfix_uri('api/sport_rules/all/by/sportid/' + sportid_)
                .set_success_msg('Found :count sport-rule sets.')
            , undefined,
            'get',
        );
    }

    /**
     *         pub deviceToken: Option<String>,
     *         pub isIos: Option<bool>,
     *         pub isDeregister: bool,
     *         pub updateLastLoggedOn: bool,
     */
    public static promisifyAfterLogin(relogin: ReloginInfo, network: INetwork, token: string, metaDevice: MetaDevice): Promise<ServerResponse<NoResultsResponse>> {
        return network.start(
            relogin,
            token,
            new HttpCall().set_postfix_uri(`api/users/afterLogin/${relogin.user.id}`)
                .set_service(Service.Api),
            JSON.stringify(metaDevice), 'POST',
        );
    }

    public static promisifyQuerySocialMessages(relogin: ReloginInfo, network: INetwork, token: string, source_id: number, target_id: number, source_type: string,
                                               target_type: string, offset: number, limit: number): Promise<ServerResponse<Pageable<SocialMessage>>> {
        return network.start(relogin,
            token,
            new HttpCall()
                .set_postfix_uri(`api/social_messages/search/paged`)
                .set_service(Service.Api),
            JSON.stringify(new Query('social_messages').set_query_info(new QueryInfo(offset, limit, false)
                .addOrderer('time_sent')).set_connectors([
                [
                    '(source_id',
                    '=',
                    `${source_id}`,
                    ' and ',
                    'target_id',
                    '=',
                    `${target_id})`,
                    ' OR ',
                    '(source_id',
                    '=',
                    `${target_id}`,
                    ' and ',
                    'target_id',
                    '=',
                    `${source_id})`,
                ],
                [
                    ' AND ',
                ],
                [
                    'source_type',
                    '=',
                    '\'f\'',
                    ' and ',
                    'target_type',
                    '=',
                    '\'f\'',
                ],

            ])), 'POST');
    }

    public static promisifySendSocialMessage(relogin: ReloginInfo, network: INetwork, token: string,
                                             source_id: number, target_id: number, source_type: string, target_type: string, message: string): Promise<ServerResponse<NoResultsResponse>> {
        return network.start(relogin, token,
            new HttpCall()
                .set_postfix_uri(`api/social_messages/one`)
                .set_service(Service.Api), JSON.stringify(
                {
                    id: null,
                    source_id: source_id,
                    target_id: target_id,
                    target_type: target_type,
                    source_type: source_type,
                    message: message,
                },
            ),
            'POST',
        );
    }

    public static promisifyOauthv2Part1(relogin: ReloginInfo, network: INetwork, token: string, provider: Provider): Promise<ServerResponse<OAuthResponsePart1>> {
        return network.start(
            relogin,
            token,
            new HttpCall().set_postfix_uri('api/oauth2/login/start/' + provider.toString())
                .set_service(Service.Api),
            null, 'GET');
    }

    public static promisifyOauthv2Part2(relogin: ReloginInfo, network: INetwork, token: string, oauth: OAuthResponse): Promise<ServerResponse<UserAndAccount>> {
        oauth.code = oauth.code.replace('%2F', '/');
        return network.start(
            relogin,
            token,
            new HttpCall().set_postfix_uri('api/oauth2/login/end')
                .set_service(Service.Api),
            JSON.stringify(oauth), 'POST');
    }

    public static promisifyNewUser(relogin: ReloginInfo, network: INetwork, token: string, user: User): Promise<ServerResponse<NoResultsResponse>> {
        return network.start(
            relogin,
            token,
            new HttpCall().set_postfix_uri('api/users').set_service(Service.Api),
            JSON.stringify(user), 'POST');
    }

    public static promisifyInvite(relogin: ReloginInfo, network: INetwork, token: string, invite: Invite, isPatch?: boolean): Promise<ServerResponse<NoResultsResponse>> {
        return network.start(
            relogin,
            token,
            new HttpCall()
                .set_postfix_uri(`api/invites`)
                .set_service(Service.Api),
            JSON.stringify(invite), isPatch ? 'PATCH' : 'POST');
    }

    public static promisifyUserIdByUnAndEmailAndPhonenumber(relogin: ReloginInfo, network: INetwork, token: string, un: string, email: string, phone: string): Promise<ServerResponse<number>> {
        return network.start(
            relogin,
            token,
            new HttpCall()
                .set_postfix_uri(`api/users/getUserId/byUn/${un}/phone/${phone}/email/${email}`)
                .set_service(Service.Api),
            undefined, 'GET');
    }

    public static promisifyUpdatePasswordFromReset(relogin: ReloginInfo, network: INetwork, pw: string, tk: number, token: string, router, dispatch): Promise<ServerResponse<NoResultsResponse>> {
        return network.start(
            relogin,
            undefined,
            new HttpCall()
                .set_postfix_uri(`api/users/updatePwd/${tk}/${pw}?token=${token}`)
                .set_service(Service.Api),
            null,
            'get', router, dispatch,
        );
    }

    public static promifisyGetOneEvent(relogin: ReloginInfo, network: INetwork, token: string, eventid: number): Promise<ServerResponse<PufEvent>> {
        return network.start(
            relogin,
            token,
            new HttpCall()
                .set_postfix_uri(`api/events_/by/id/${eventid}`)
                .set_service(Service.Api)
                .set_no_messages(false)
                .set_success_msg(`Retrieved event.`),
            undefined,
            'get',
        );
    }

    /**
     * Looks up a "forum" for a particular user.
     * Set badgesdetermined to true if you want to see only historical data
     * Set it to false if you want to see current undetermined voting data...
     * @param relogin
     * @param network
     * @param token
     * @param forumlookup
     */
    public static promisifyVoteSessionsAndVotesAndEventUserMembers(relogin: ReloginInfo, network: INetwork, token: string, forumlookup: ForumLookup): Promise<ServerResponse<VoteSessionVotesEventMembers[]>> {
        return network.start(
            relogin,
            token,
            new HttpCall()
                .set_postfix_uri(`api/forum`)
                .set_service(Service.Api)
                .set_no_messages(false)
                .set_success_msg(`Retrieved :count pending vote sessions.`),
            JSON.stringify(forumlookup),
            'post',
        );
    }

    public static promisifyVote(relogin: ReloginInfo, network: INetwork, token: string, vote: Vote): Promise<ServerResponse<NoResultsResponse>> {
        return network.start(
            relogin,
            token,
            new HttpCall()
                .set_service(Service.Api)
                .set_no_messages(false)
                .set_success_msg('Successfully voted!')
                .set_postfix_uri(`api/vote`),
            JSON.stringify(vote),
            'post',
        );
    }

    public static promisifyGetVotesForVoteSession(relogin: ReloginInfo, network: INetwork, token: string, vote_session_id: number): Promise<ServerResponse<Vote[]>> {
        return network.start(
            relogin,
            token,
            new HttpCall()
                .set_postfix_uri('api/vote/all/by/vote_session_id/' + vote_session_id)
                .set_no_messages(false)
                .set_service(Service.Api)
                .set_success_msg(`Successfully submitted player review!`),
            undefined,
            'get',
        );
    }

    public static promisifyPatchVote(relogin: ReloginInfo, network: INetwork, token: string, vote_id: number, vote: Vote): Promise<ServerResponse<NoResultsResponse>> {
        return network.start(
            relogin,
            token,
            new HttpCall()
                .set_service(Service.Api)
                .set_postfix_uri('api/vote/id/' + vote_id)
                .set_no_messages(false)
                .set_success_msg(`Successfully updated vote.`),
            JSON.stringify(vote),
            'patch',
        );
    }

    public static promisifyAllVotesByVoteSessionId(relogin: ReloginInfo, network: INetwork, token: string, vote_session_id: number): Promise<ServerResponse<Vote[]>> {
        return network.start(
            relogin,
            token,
            new HttpCall()
                .set_service(Service.Api)
                .set_postfix_uri('api/vote/all/by/vote_session_id/' + vote_session_id)
                .set_no_messages(false)
                .set_success_msg(`Successfully received all votes by for vote session #` + vote_session_id),
            undefined,
            'get',
        );
    }

    public static promisifyDeleteVote(relogin: ReloginInfo, network: INetwork, token: string, vote_id: number): Promise<ServerResponse<NoResultsResponse>> {
        return network.start(
            relogin,
            token,
            new HttpCall()
                .set_postfix_uri('api/vote/by/id' + vote_id)
                .set_no_messages(false)
                .set_service(Service.Api)
                .set_success_msg(`Successfully deleted vote.`),
            undefined,
            'delete',
        );
    }


    public static promisifySaveAthleteReview(relogin: ReloginInfo, network: INetwork, token: string, data: any): Promise<ServerResponse<NoResultsResponse>> {
        return network.start(
            relogin,
            token,
            new HttpCall()
                .set_postfix_uri('api/player_reviews')
                .set_no_messages(false)
                .set_service(Service.Api)
                .set_success_msg(`Successfully submitted player review!`),
            JSON.stringify(data),
            'post',
        );
    }

    public static promisifySavePlayableLocationReview(relogin: ReloginInfo, network: INetwork, token: string, data: any): Promise<ServerResponse<NoResultsResponse>> {
        return network.start(
            relogin,
            token,
            new HttpCall()
                .set_postfix_uri('api/playable_location_reviews')
                .set_no_messages(false)
                .set_service(Service.Api)
                .set_success_msg(`Successfully submitted location review!`),
            JSON.stringify(data),
            'post',
        );
    }

    public static promisifyPendingReviews(relogin: ReloginInfo, network: INetwork, token: string, uid: number): Promise<ServerResponse<Pageable<BillToReview>>> {
        const query = new Query('puf_bill_to_review');
        const queryinfo = new QueryInfo(0, 200, true).addOrderer('unreviewedid');
        query.set_query_info(queryinfo);
        query.set_connectors([['uid', '=', String(uid)]]);
        return network.start(
            relogin,
            token,
            new HttpCall()
                .set_postfix_uri('api/puf_bill_to_review/search/paged')
                .set_no_messages(false)
                .set_service(Service.Api)
                .set_success_msg(`You have :count pending reviews.`),
            query.stringify(),
            'post',
        );
    }


    public static promisifyGetMarkersByCenter(relogin: ReloginInfo, network: INetwork, token: string, centerLat: number, centerLong: number, radius?: number): Promise<ServerResponse<PlayableLocation[]>> {
        const url = 'api/playable_locations/search/latlngradius';
        return network
            .start(
                relogin,
                token,
                new HttpCall()
                    .set_no_messages(false)
                    .set_service(Service.Api)
                    .set_success_msg(':count locations nearby.')
                    //.set_dispatch_additional_action({ type: 'SET_MARKERS_META' })
                    .set_postfix_uri(url),
                JSON.stringify({
                    lat: centerLat,
                    long: centerLong,
                    radius: radius ? radius : 100,
                }),
                'post',
            );
    }

    public static setProfilePic(relogin: ReloginInfo, network: INetwork, token: string, uid: number, pictureS3Key: string): Promise<ServerResponse<NoResultsResponse>> {
        return network.start(
            relogin,
            token,
            new HttpCall()
                .set_service(Service.Api)
                .set_postfix_uri(`api/users/${uid}/profilepic/${pictureS3Key}`)
                .set_success_msg('Successfully updated profile picture.'),
            undefined,
            'PATCH',
        );
    }

    public static setTeamPicture(relogin: ReloginInfo, network: INetwork, token: string, teamid: number, pictureS3Key: string): Promise<ServerResponse<NoResultsResponse>> {
        return network.start(
            relogin,
            token,
            new HttpCall()
                .set_service(Service.Api)
                .set_postfix_uri(`api/teams/${teamid}/picture/${pictureS3Key}`)
                .set_success_msg('Successfully updated team picture.'),
            undefined,
            'PATCH',
        );
    }

    public static getFacilitiesByPlaceId(relogin: ReloginInfo, network: INetwork, token: string,
                                         placeid: number,
    ): Promise<ServerResponse<Facility[]>> {
        return network.start(
            relogin,
            token,
            new HttpCall()
                .set_service(Service.Api)
                .set_postfix_uri('api/facilities/all/by/placeid/' + placeid)
                .set_success_msg('Found :count facilities'),
            undefined,
            'get',
        );
    }

    public static getSportPositionsBySportId(relogin: ReloginInfo, network: INetwork, token: string, sportid: number): Promise<ServerResponse<Array<SportPosition>>> {
        return network.start(
            relogin,
            token,
            new HttpCall()
                .set_service(Service.Api)
                .set_success_msg('Found :count sport positions.')
                .set_postfix_uri('api/sport_positions/all/by/sportid/' + sportid),
            undefined,
            'get',
        );
    }

    public static promisifyAtlasDetails(relogin: ReloginInfo, network: INetwork, token: string,
                                        location: FilterableAtlasRequest,
    ): Promise<ServerResponse<MapDetails>> {
        return network.start(
            relogin,
            token,
            new HttpCall()
                .set_success_msg('Atlas updated.')
                .set_no_messages(true)
                .set_service(Service.Api)
                /*.set_dispatch_response_body_action({
                        type: 'UPDATE_MAP_DETAILS',
                        key: 'details',
                })*/
                .set_postfix_uri('api/atlas/layer/all'),
            JSON.stringify(location),
            'post',
        );
    }

    /*
            public static promisifyUser(un: string): Promise<{
                    isSuccessful: boolean;
                    resp: any;
            }> {
                    const network = new Network(1);
                    return network.start(
                            true,
                            new HttpCall()
                                    .set_success_msg('Found ' + un + '.')
                                    .set_no_messages(true)
                                    .set_postfix_uri('api/users/search/paged'),
                            new Query('users')
                                    .add_connector(['un', '=', `'${un}'`])
                                    .set_query_info(new QueryInfo(0, 1, true).addOrderer('un')),
                            'post',
                    );
            }*/
    /**
     * {
     *    "notificationType": "quickmatch-created",
     *    "recipientUserIds": [0],
     *    "recipientUserDevices" : null,
     *    "eventId" : null,
     *    "requesterFirstName": null,
     *    "requesterLastName": null,
     *    "supercede_user_preferences": false,
     *    "table_name": null,
     *    "table_key": null,
     *    "phoneNumbers": null,
     *    "emailAddresses": null,
     *    "timezone_minute_offset": 0
     * }
     * @param notification
     */
    public static sendVerification(relogin: ReloginInfo, network: INetwork, token: string,
                                   verificationRequest: Verification,
    ): Promise<ServerResponse<NoResultsResponse>> {
        return network.start(
            relogin,
            token,
            new HttpCall()
                .set_success_msg('Verify your email address and phone number.')
                .set_no_messages(false)
                .set_service(Service.Api)
                .set_postfix_uri('api/verifications'),
            JSON.stringify(verificationRequest),
            'post',
        );
    }

    public static promisifyUpdateProfilemeta(relogin: ReloginInfo, network: INetwork, token: string, profileMeta: Object, uid: number): Promise<ServerResponse<NoResultsResponse>> {
        return network.start(
            relogin,
            token,
            new HttpCall()
                .set_no_messages(false)
                .set_service(Service.Api)
                .set_postfix_uri('api/users/profilemeta/' + uid),
            JSON.stringify(profileMeta),
            'patch',
        );
    }

    public static promisifyCustomPageablePublicUsers(relogin: ReloginInfo, network: INetwork, token: string, query: QueryType): Promise<ServerResponse<Pageable<PublicUser>>> {
        return network.start(
            relogin,
            token,
            new HttpCall()
                .set_no_messages(false)
                .set_service(Service.Api)
                .set_postfix_uri('api/puf_pub_users/search/paged'),
            JSON.stringify(query),
            'post',
        );
    }

    public static promisifySportInterestsByUserid(relogin: ReloginInfo, network: INetwork, token: string, uid: number): Promise<ServerResponse<SportInterest[]>> {
        return network.start(
            relogin,
            token,
            new HttpCall()
                .set_success_msg('Retrieved :count sport interests/skills.')
                .set_no_messages(false)
                .set_service(Service.Api)
                .set_postfix_uri('api/user_sport_interests/all/by/uid/' + uid),
            undefined,
            'get',
        );
    }

    public static promisifyUserBadges(relogin: ReloginInfo, network: INetwork, token: string, uid: number): Promise<ServerResponse<UserBadge[]>> {
        const url = 'api/user_badges/all/by/uid/' + uid;
        return network.start(
            relogin,
            token,
            new HttpCall()
                .set_no_messages(false)
                .set_postfix_uri(url)
                .set_service(Service.Api),
            undefined,
            'get',
        );
    }

    /**
     * Works on any table object.
     * @param relogin
     * @param network
     * @param token
     * @param obj
     * @param table_name
     * @param crudType
     * @param id
     */
    public static promisifyCrudToAnyTable<T>(relogin: ReloginInfo, network: INetwork, token: string, obj: Object | undefined, table_name: string, crudType: CrudType, id?: number): Promise<ServerResponse<T | NoResultsResponse>> {
        let method;
        switch (crudType) {
            case CrudType.Read: {
                method = 'get';
                break;
            }
            case CrudType.Update: {
                method = 'patch';
                break;
            }
            case CrudType.Delete: {
                method = 'delete';
                break;
            }
            case CrudType.Create: {
                method = 'post';
                break;
            }
            default: {
                method = 'post';
            }
        }
        let uri;
        if (!crudType || crudType === CrudType.Create) {
            uri = 'api/' + table_name;
        } else if (crudType === CrudType.Update) {
            uri = `api/${table_name}/id/${id}`;
        } else if (crudType === CrudType.Delete) {
            uri = `api/${table_name}/by/id/${id}`;
        } else {
            uri = `api/${table_name}/one/by/id/${id}`;
        }
        return network.start(
            relogin,
            token,
            new HttpCall()
                .set_no_messages(false)
                .set_postfix_uri(uri)
                .set_service(Service.Api),
            crudType === CrudType.Delete || crudType === CrudType.Read ? undefined : JSON.stringify(obj),
            method,
        );
    }

    public static getSportListPromise(relogin: ReloginInfo, network: INetwork, token: string, onlyapproved: boolean): Promise<ServerResponse<Pageable<Sport>>> {
        return network.start(
            relogin,
            token,
            new HttpCall()
                .set_success_msg('Found :count sports.')
                .set_no_messages(false)
                .set_service(Service.Api)
                .set_postfix_uri('api/sports/search/paged'),
            JSON.stringify({
                table_name: 'sports',
                operator_connectors: onlyapproved ? [['isapproved', '=', 'true']] : [],
                page_info: {
                    ordered_by: ['isapproved asc', 'name'],
                    offset: 0,
                    limit: 50,
                    asc: false,
                },
            }),
            'post',
        );
    }

    public static getSportRulesList(relogin: ReloginInfo, network: INetwork, token: string): Promise<ServerResponse<Pageable<SportRules>>> {
        return network.start(
            relogin,
            token,
            new HttpCall()
                .set_success_msg('Found :count sports.')
                .set_no_messages(false)
                .set_service(Service.Api)
                .set_postfix_uri('api/sport_rules/search/paged'),
            JSON.stringify({
                table_name: 'sport_rules',
                operator_connectors: [],
                page_info: {
                    ordered_by: ['sportid'],
                    offset: 0,
                    limit: 5000,
                    asc: false,
                },
            }),
            'post',
        );
    }

    public static promisifySingleDelete(relogin: ReloginInfo, network: INetwork, token: string,
                                        table: string,
                                        id: number,
    ): Promise<ServerResponse<NoResultsResponse>> {
        const httpCall = new HttpCall()
            .set_no_messages(false)
            .set_service(Service.Api)
            .set_postfix_uri(`api/${table}/by/id/${id}`);
        return network.start(
            relogin, token, httpCall, '', 'DELETE', false);
    }

    public static promisifySuggestedEvents(relogin: ReloginInfo, network: INetwork, token: string,
                                           id: number,
                                           connectors: string[][],
    ): Promise<ServerResponse<Pageable<SuggestedEvent>>> {
        const req: Query = new Query('puf_suggested_events')
            .set_connectors([['suggested_uid', '=', `${id}`]].concat(connectors))
            .set_query_info(new QueryInfo(0, 10, false).addOrderer('timestarts DESC').addOrderer('lastchangedon DESC').addOrderer('dt_created'));
        const httpCall = new HttpCall()
            .set_success_msg('Found :count suggested events.')
            .set_no_messages(false)
            .set_service(Service.Api)
            .set_postfix_uri('api/puf_suggested_events/search/paged');
        return network.start(
            relogin, token, httpCall, JSON.stringify(req), 'POST', false);
    }


    public static promisifySuggestedEventsByLocation(relogin: ReloginInfo, network: INetwork, token: string,
                                                     id: number, connectors: string[][], location: LocationRequest,
    ): Promise<ServerResponse<Pageable<SuggestedEvent>>> {
        const req: FilterLocationRequest = new Query('puf_suggested_events')
            .set_connectors([['suggested_uid', '=', `${id}`]].concat(connectors))
            .set_query_info(new QueryInfo(0, 10, false).addOrderer('timestarts DESC').addOrderer('lastchangedon DESC').addOrderer('dt_created'))
            .toFilterLocationRequest(location);
        const httpCall = new HttpCall()
            .set_success_msg('Found :count suggested events.')
            .set_no_messages(false)
            .set_service(Service.Api)
            .set_postfix_uri('api/puf_suggested_events/search/location/paged');
        return network.start(
            relogin, token, httpCall, JSON.stringify(req), 'POST', false);
    }

    public static promisifyPublicUserEvents(relogin: ReloginInfo, network: INetwork, token: string,
                                            uid: number,
                                            connectors: string[][],
    ): Promise<ServerResponse<Pageable<UserEvent>>> {
        const httpCall = new HttpCall()
            .set_success_msg('Found :count scheduled events.')
            .set_no_messages(false)
            .set_service(Service.Api)
            .set_postfix_uri('api/puf_user_events/search/paged');
        const body = new Query('puf_user_events')
            .set_connectors([['uid', '=', `${uid}`]].concat(connectors))
            .set_query_info(new QueryInfo(0, 100, false).addOrderer('timestarts DESC').addOrderer('lastchangedon DESC').addOrderer('dt_created'));
        return network.start(
            relogin,
            token,
            httpCall,
            JSON.stringify(body),
            'POST',
            false,
        );
    }

    public static promisifyPublicUsersByEventId(relogin: ReloginInfo, network: INetwork, token: string,
                                                eventid: number,
    ): Promise<ServerResponse<Pageable<PublicUser>>> {
        const httpCall = new HttpCall()
            .set_success_msg('Retreived :count athlete stats.')
            .set_no_messages(false)
            .set_service(Service.Api)
            .set_postfix_uri('api/puf_pub_users/paged/by/eventid/' + eventid);
        return network.start(
            relogin,
            token,
            httpCall,
            JSON.stringify({
                limit: 1000,
                offset: 0,
                ordered_by: ['un'],
                asc: false,
            }),
            'POST',
            false,
        );
    }

    public static promisifySportParticipationStats(relogin: ReloginInfo, network: INetwork, token: string,
                                                   id: number,
    ): Promise<ServerResponse<Pageable<UserSportParticipationStats>>> {
        const httpCall = new HttpCall()
            .set_success_msg('Retreived :count sport-participation stats.')
            .set_no_messages(false)
            .set_service(Service.Api)
            .set_postfix_uri('api/puf_user_sport_participation_stats/search/paged');
        return network.start(
            relogin,
            token,
            httpCall,
            new Query('puf_user_sport_participation_stats')
                .set_connectors([['uid', '=', `${id}`]])
                .set_query_info(
                    new QueryInfo(0, 100, false)
                        .addOrderer('rules_percentage')
                        .addOrderer('sport_percentage'),
                ).stringify(),
            'POST',
            false,
        );
    }

    public static promisifyGetTeamAndTeammembers(relogin: ReloginInfo, network: INetwork, token: string,
                                                 eid: number,
    ): Promise<ServerResponse<TeamAndPubEventTeamMember[]>> {
        return network.start(
            relogin,
            token,
            new HttpCall()
                .set_postfix_uri('api/teamsAndPubTeamMembers/allby/eventid/' + eid)
                .set_service(Service.Api)
                .set_success_msg('Found :count teams'),
            undefined,
            'get',
        );
    }

    public static promisifyPlayerStats(relogin: ReloginInfo, network: INetwork, token: string, id: number): Promise<ServerResponse<Pageable<PlayerStats>>> {
        const httpCall = new HttpCall()
            .set_success_msg('Retreived player statistics.')
            .set_no_messages(false)
            .set_service(Service.Api)
            .set_postfix_uri('api/puf_player_stats/search/paged');
        return network.start(
            relogin,
            token,
            httpCall,
            new Query('puf_player_stats')
                .set_connectors([['uid', '=', `${id}`]])
                .set_query_info(new QueryInfo(0, 1, false).addOrderer('uid')).stringify(),
            'POST',
            false,
        );
    }

    public static promisifyMetaLists(relogin: ReloginInfo, network: INetwork, token: string): Promise<ServerResponse<Pageable<MetaList>>> {
        const httpCall = new HttpCall()
            .set_no_messages(true)
            .set_service(Service.Api)
            .set_postfix_uri('api/metalists/search/paged');
        return network.start(
            relogin,
            token,
            httpCall,
            new Query('meta_lists').stringify(),
            'POST',
            true,
        );
    }

    public static promisifyPublicUsers(relogin: ReloginInfo, network: INetwork, token: string,
                                       idList: number[],
                                       offset: number = 0,
                                       limit: number = 300,
                                       isasc = true,
                                       orderon = 'uid',
    ): Promise<ServerResponse<Pageable<PublicUser>>> {
        const httpCall = new HttpCall()
            .set_success_msg('Successfully found :count users!')
            .set_no_messages(false)
            .set_service(Service.Api)
            .set_postfix_uri('api/puf_pub_users/search/paged');
        return network.start(
            relogin,
            token,
            httpCall,
            new Query('puf_pub_users')
                .set_connectors([['uid', 'in', `(${idList.join(',')})`]])
                .set_query_info(new QueryInfo(0, 300, isasc).addOrderer(orderon)),
            'POST',
            false,
        );
    }

}
