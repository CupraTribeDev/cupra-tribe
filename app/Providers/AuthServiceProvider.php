<?php

namespace App\Providers;

// use Illuminate\Support\Facades\Gate;

use App\Http\Controllers\AdminController;
use App\Policies\AdminPolicy;
use Illuminate\Auth\Access\Response;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        // 'App\Models\Model' => 'App\Policies\ModelPolicy',
    ];

    /**
     * Register any authentication / authorization services.
     *
     * @return void
     */
    public function boot()
    {
        $this->registerPolicies();

	Gate::define('isAdmin', function ($admin) {
	    return $admin->hasRole('admin')
		? Response::allow()
		: Response::denyAsNotFound();
	});

	Gate::define('owns', function ($user, $resource_foreign_key)
	{
	    return $user->owns($resource_foreign_key)
		? Response::allow()
		: Response::denyWithStatus(403, 'Metti le mani solo sulle cose tue ;)');
	});

	Gate::define('notBanned', function ($user)
	{
	    return $user->checkBan()
		    ? Response::allow()
		    : Response::denyWithStatus(403, "Azione non consentita dopo il ban");
	});

    }
}
