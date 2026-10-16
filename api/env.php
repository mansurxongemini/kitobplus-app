<?php
	// Окружение: production (по умолчанию), staging или local.
	// Задаётся в конфигурации веб-сервера: SetEnv KP_ENV staging. Если не задано, считается production,
	// поэтому отладочное поведение на рабочем сервере не включится по ошибке.
	function kp_env() {
		$env = $_SERVER['KP_ENV'] ?? getenv('KP_ENV');
		return in_array($env, ['local', 'staging'], true) ? $env : 'production';
	}

	function kp_is_production() {
		return kp_env() === 'production';
	}
